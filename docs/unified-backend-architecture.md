# Unified Backend Architecture — Harmony

> **Scope:** This document specifies the shared backend that powers all three P3 features—**Channel Visibility Toggle**, **Guest Public Channel View**, and **SEO Meta Tag Generation**—in a single, cohesive service layer. It is the authoritative reference for module boundaries, data models, APIs, and class ownership.

---

## 1. Design Rationale

### 1.1 Why a Unified Backend?

Each feature spec was authored independently and defines its own modules, classes, and schemas. Left unmerged, the codebase would contain three competing `ChannelRepository` classes, duplicate cache logic, and inconsistent database schemas. A unified backend eliminates this redundancy while preserving each feature's domain-specific logic.

### 1.2 Key Design Choices

| Decision | Choice | Justification |
|----------|--------|---------------|
| **Primary Language** | TypeScript 5.3+ | End-to-end type safety (client + server); single language reduces context-switching. |
| **Database** | PostgreSQL 16+ | ACID guarantees for visibility state transitions; native `ENUM` types for visibility; `JSONB` for flexible audit payloads; partial indexes for efficient public-channel queries. |
| **Cache / EventBus** | Redis 7.2+ | Sub-millisecond reads for visibility checks on every public page load; Pub/Sub for cross-module event propagation (`VISIBILITY_CHANGED`, `MESSAGE_CREATED`, etc.) without tight coupling. |
| **Authenticated APIs** | tRPC 11 | End-to-end type inference between Next.js client and Express server; eliminates hand-written API clients for admin operations. |
| **Public APIs** | REST (Express) | Search-engine crawlers, social-media link unfurlers, and external consumers require plain HTTP. tRPC's binary protocol is invisible to these consumers. |
| **ORM** | Prisma 5.8+ | Type-safe schema definitions; auto-generated migrations; integrates with PostgreSQL enums. |
| **Runtime Validation** | Zod 3.22+ | Composes with tRPC for automatic request/response validation; shared between client and server. |
| **SSR Framework** | Next.js 14+ | Server-side rendering is critical for SEO; server components reduce client bundle for public pages. |
| **HTML Sanitization** | sanitize-html 2.12+ | XSS prevention for user-generated content rendered on public pages. Node.js-native (no DOM dependency). |

### 1.3 tRPC + REST Split

```
┌──────────────────────────────────────────────────────────────────┐
│                        API Surface                                │
├──────────────────────┬───────────────────────────────────────────┤
│   tRPC (Authenticated)│         REST (Public/Unauthenticated)     │
│                      │                                           │
│  • Channel settings  │  • GET /c/{server}/{channel}  (SSR page)  │
│  • Visibility toggle │  • GET /api/public/channels/…  (messages) │
│  • Audit log queries │  • GET /api/public/servers/…   (server)   │
│  • Admin meta-tag    │  • GET /sitemap/{server}.xml              │
│    overrides         │  • GET /robots.txt                        │
│                      │  • GET /s/{server}  (server landing)      │
└──────────────────────┴───────────────────────────────────────────┘
```

**Why the split?** Crawlers (Googlebot, Bingbot) and social-media unfurlers (Facebook, Twitter/X, Slack) make standard HTTP requests. They cannot consume tRPC. Admin operations (visibility toggling, meta-tag overrides) benefit from tRPC's type inference and are only used by authenticated Harmony clients.

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph External["External Actors"]
        Admin["🔑 Admin User"]
        Guest["👤 Guest User"]
        Bot["🤖 Search Engine Bot"]
    end

    subgraph Client["Client Layer — Next.js"]
        AdminUI["Admin Dashboard<br/>(M-CV1)"]
        PublicUI["Public View SSR<br/>(M-GV1)"]
        ClientInt["Client Interaction<br/>(M-GV2)"]
    end

    subgraph Server["Server Layer — Express + tRPC"]
        APIGateway["API Gateway<br/>(M-B1)"]
        AccessCtrl["Access Control<br/>(M-B2)"]
        VisBiz["Visibility Service<br/>(M-B3)"]
        ContentDel["Content Delivery<br/>(M-B4)"]
        MetaTag["Meta Tag Engine<br/>(M-B5)"]
        SEOIndex["SEO & Indexing<br/>(M-B6)"]
        BgProcess["Background Workers<br/>(M-B7)"]
    end

    subgraph Data["Data Layer"]
        PG[("PostgreSQL")]
        Redis[("Redis<br/>Cache + Pub/Sub")]
    end

    subgraph ExtSystems["External Systems"]
        Google["Google Search Console"]
        Bing["Bing Webmaster API"]
    end

    Admin -->|tRPC| AdminUI
    Guest -->|HTTPS| PublicUI
    Bot -->|HTTPS| PublicUI
    AdminUI -->|tRPC| APIGateway
    PublicUI -->|Internal| APIGateway
    ClientInt -->|REST| APIGateway
    APIGateway --> AccessCtrl
    APIGateway --> VisBiz
    APIGateway --> ContentDel
    APIGateway --> MetaTag
    AccessCtrl --> VisBiz
    VisBiz --> SEOIndex
    ContentDel --> MetaTag
    SEOIndex --> BgProcess
    VisBiz --> PG
    ContentDel --> PG
    MetaTag --> PG
    VisBiz --> Redis
    ContentDel --> Redis
    MetaTag --> Redis
    BgProcess --> Redis
    BgProcess --> Google
    BgProcess --> Bing
    SEOIndex --> Redis
```

### 2.2 Module Map

The unified backend organizes into **shared backend modules** (prefixed `M-B`) and **data layer modules** (prefixed `M-D`). Client-layer modules are listed for reference only; they are specified in their respective feature dev specs.

| Module ID | Name | Layer | Feature Owner | Purpose |
|-----------|------|-------|---------------|---------|
| *M-CV1* | *Admin Dashboard* | *Client* | *Channel Visibility Toggle* | *Specified in [channel visibility spec](./dev-spec-channel-visibility-toggle.md)* |
| *M-CV2* | *Public Channel Viewer* | *Client* | *Channel Visibility Toggle* | *Specified in [channel visibility spec](./dev-spec-channel-visibility-toggle.md)* |
| *M-GV1* | *Public View (SSR)* | *Client* | *Guest Public Channel View* | *Specified in [guest public channel spec](./dev-spec-guest-public-channel-view.md)* |
| *M-GV2* | *Client Interaction* | *Client* | *Guest Public Channel View* | *Specified in [guest public channel spec](./dev-spec-guest-public-channel-view.md)* |
| M-B1 | API Gateway | Server | Shared | tRPC router (authenticated) + REST controllers (public) |
| M-B2 | Access Control | Server | Shared | Visibility guard, content filter, rate limiter, anonymous sessions |
| M-B3 | Visibility Management | Server | Channel Visibility Toggle | Visibility state machine, permission checks, audit logging |
| M-B4 | Content Delivery | Server | Guest Public Channel View | Message retrieval, author privacy, attachment processing |
| M-B5 | Meta Tag Engine | Server | SEO Meta Tag Generation | Meta tag generation, content analysis, OpenGraph, structured data |
| M-B6 | SEO & Indexing | Server | Shared | Sitemap generation, search engine notifications, canonical URLs, robots directives |
| M-B7 | Background Workers | Server | Shared | Async workers for meta-tag regeneration, sitemap rebuilds, search engine pings (Redis Pub/Sub driven) |
| M-D1 | Data Access | Data | Shared | Repositories (Channel, Message, Server, User, Attachment, AuditLog, MetaTag) |
| M-D2 | Persistence | Data | Shared | PostgreSQL schemas (all tables) |
| M-D3 | Cache | Data | Shared | Redis cache schemas and Pub/Sub event channels |

---

## 3. Unified Class Hierarchy

### 3.1 Core Entities

```mermaid
classDiagram
    class Server {
        <<entity>>
        +id: UUID
        +name: string
        +slug: string
        +description: string?
        +iconUrl: string?
        +isPublic: boolean
        +memberCount: number
        +createdAt: DateTime
    }

    class Channel {
        <<entity>>
        +id: UUID
        +serverId: UUID
        +name: string
        +slug: string
        +type: ChannelType
        +visibility: ChannelVisibility
        +topic: string?
        +position: number
        +indexedAt: DateTime?
        +createdAt: DateTime
        +updatedAt: DateTime
    }

    class Message {
        <<entity>>
        +id: UUID
        +channelId: UUID
        +authorId: UUID
        +content: string
        +createdAt: DateTime
        +editedAt: DateTime?
        +isDeleted: boolean
    }

    class User {
        <<entity>>
        +id: UUID
        +username: string
        +displayName: string
        +avatarUrl: string?
        +publicProfile: boolean
        +createdAt: DateTime
    }

    class Attachment {
        <<entity>>
        +id: UUID
        +messageId: UUID
        +filename: string
        +url: string
        +contentType: string
        +sizeBytes: number
    }

    class AuditLogEntry {
        <<entity>>
        +id: UUID
        +channelId: UUID
        +actorId: UUID
        +action: string
        +oldValue: JSON
        +newValue: JSON
        +timestamp: DateTime
        +ipAddress: string
        +userAgent: string
    }

    class GeneratedMetaTags {
        <<entity>>
        +id: UUID
        +channelId: UUID
        +title: string
        +description: string
        +ogTitle: string
        +ogDescription: string
        +ogImage: string?
        +twitterCard: string
        +keywords: string[]
        +structuredData: JSON
        %% keywords is stored as JSON text in PostgreSQL
        +contentHash: string
        +needsRegeneration: boolean
        +generatedAt: DateTime
        +schemaVersion: number
    }

    Server "1" --> "*" Channel
    Channel "1" --> "*" Message
    Message "*" --> "1" User
    Message "1" --> "*" Attachment
    Channel "1" --> "*" AuditLogEntry
    Channel "1" --> "0..1" GeneratedMetaTags
```

> **Entity methods note:** `isPublic()` and `isIndexable()` are logical helpers shown in older diagrams. Because Prisma returns plain data objects, these **must not** be implemented as class methods on the entity. Implement them as utility functions in the service layer (e.g., `isPublicChannel(channel: Channel): boolean` in `visibility.service.ts`).

### 3.2 Interfaces, Enums & Events

```mermaid
classDiagram
    class IVisibilityToggle {
        <<interface>>
        +setVisibility(channelId, visibility, actorId, ip) VisibilityChangeResult
        +getVisibility(channelId) ChannelVisibility
        +canChangeVisibility(channelId, actorId) boolean
    }

    class IMetaTagGenerator {
        <<interface>>
        +generate(channelId) MetaTagSet
        +validate(tags) ValidationResult
    }

    class ChannelType {
        <<enumeration>>
        TEXT
        VOICE
        ANNOUNCEMENT
    }

    class ChannelVisibility {
        <<enumeration>>
        PUBLIC_INDEXABLE
        PUBLIC_NO_INDEX
        PRIVATE
    }

    class VisibilityChangeEvent {
        <<event>>
        +channelId: UUID
        +oldVisibility: ChannelVisibility
        +newVisibility: ChannelVisibility
        +actorId: UUID
        +timestamp: DateTime
    }

    VisibilityChangeEvent --> ChannelVisibility
```

### 3.3 Data Transfer Objects (DTOs)

```mermaid
classDiagram
    class PublicChannelDTO {
        <<DTO>>
        +id: string
        +name: string
        +slug: string
        +topic: string
        +messageCount: number
        +serverSlug: string
    }

    class PublicMessageDTO {
        <<DTO>>
        +id: string
        +content: string
        +author: PublicAuthorDTO
        +createdAt: string
        +editedAt: string?
        +attachments: PublicAttachmentDTO[]
    }

    class PublicAuthorDTO {
        <<DTO>>
        +displayName: string
        +avatarUrl: string?
    }

    class PublicServerDTO {
        <<DTO>>
        +name: string
        +slug: string
        +description: string?
        +iconUrl: string?
        +memberCount: number
        +publicChannelCount: number
    }

    class PublicAttachmentDTO {
        <<DTO>>
        +id: string
        +filename: string
        +url: string
        +contentType: string
        +sizeBytes: number
    }

    class OpenGraphTags {
        <<DTO>>
        +type: string
        +title: string
        +description: string
        +image: string?
        +url: string
    }

    class TwitterCardTags {
        <<DTO>>
        +card: string
        +title: string
        +description: string
        +image: string?
    }

    class MetaTagSet {
        <<DTO>>
        +title: string
        +description: string
        +ogTags: OpenGraphTags
        +twitterCard: TwitterCardTags
        +structuredData: JSON
        +canonicalUrl: string
        +robots: string
    }

    class VisibilityUpdateRequest {
        <<DTO>>
        +visibility: ChannelVisibility
    }

    class VisibilityUpdateResponse {
        <<DTO>>
        +success: boolean
        +channel: PublicChannelDTO
        +previousVisibility: ChannelVisibility
        +indexingStatus: string
    }

    PublicMessageDTO --> PublicAuthorDTO
    PublicMessageDTO --> PublicAttachmentDTO
    MetaTagSet --> OpenGraphTags
    MetaTagSet --> TwitterCardTags
    VisibilityUpdateResponse --> PublicChannelDTO
```

### 3.3b Response & Page Types

```mermaid
classDiagram
    class ChannelSettingsResponse {
        <<DTO>>
        +channelId: string
        +visibility: ChannelVisibility
        +canChangeVisibility: boolean
        +lastModified: string
    }

    class AuditLogResponse {
        <<DTO>>
        +entries: AuditLogEntry[]
        +total: number
        +page: number
        +hasMore: boolean
    }

    class PublicChannelPage {
        <<DTO>>
        +channel: PublicChannelDTO
        +server: PublicServerDTO
        +messages: PublicMessageDTO[]
        +metaTags: MetaTagSet
        +pagination: PaginationInfo
    }

    class PublicMessagesResponse {
        <<DTO>>
        +messages: PublicMessageDTO[]
        +page: number
        +hasMore: boolean
        +total: number
    }

    class ServerLandingPage {
        <<DTO>>
        +server: PublicServerDTO
        +channels: PublicChannelDTO[]
        +metaTags: MetaTagSet
    }

    class SitemapXML {
        <<DTO>>
        +xml: string
        +lastModified: DateTime
    }

    class RobotsTxt {
        <<DTO>>
        +content: string
    }
```

### 3.3c Internal Result Types

These types are returned by services and repositories. They are not exposed over the API.

| Type | Fields | Returned By |
|------|--------|-------------|
| `VisibilityChangeResult` | `success: boolean`, `channelId: UUID`, `oldVisibility: ChannelVisibility`, `newVisibility: ChannelVisibility`, `auditLogId: UUID` | `ChannelVisibilityService.setVisibility()` |
| `ValidationResult` | `valid: boolean`, `errors: string[]` | `ChannelVisibilityService.validateTransition()`, `IMetaTagGenerator.validate()` |
| `PermissionSet` | `canManageChannel: boolean`, `canChangeVisibility: boolean`, `isServerAdmin: boolean`, `permissions: string[]` | `PermissionService.getEffectivePermissions()` |
| `ContentAnalysis` | `keywords: string[]`, `topics: string[]`, `summary: string`, `category: string` | `ContentAnalyzer.analyzeThread()` |
| `NotificationResult` | `success: boolean`, `provider: string`, `timestamp: DateTime`, `error: string?` | `IndexingService.notifySearchEngines()` |
| `RobotsDirectives` | `index: boolean`, `follow: boolean`, `robotsTag: string` | `IndexingService.getRobotsDirectives()` |
| `ChannelMetadata` | `messageCount: number`, `lastActivity: DateTime`, `activeUsers: number` | `ChannelRepository.getMetadata()` |
| `PaginationInfo` | `page: number`, `limit: number`, `total: number`, `hasMore: boolean` | Used in page response types |
| `GuestSession` | `sessionId: string`, `preferences: { theme?: string, locale?: string }`, `createdAt: DateTime`, `expiresAt: DateTime` | `AnonymousSessionManager.getSession()` |

### 3.4 API Controllers (M-B1)

```mermaid
classDiagram
    class ChannelController {
        +getChannelBySlug(serverSlug, channelSlug, ctx) ChannelSettingsResponse
        +getChannelSettings(channelId, ctx) ChannelSettingsResponse
        +updateChannelVisibility(channelId, body, ctx) VisibilityUpdateResponse
        +getVisibilityAuditLog(channelId, query, ctx) AuditLogResponse
        -validateAdminAccess(userId, channelId) boolean
    }

    class PublicChannelController {
        +getPublicChannelPage(serverSlug, channelSlug) PublicChannelPage
        +getPublicMessages(channelId, query) PublicMessagesResponse
        +getPublicMessage(channelId, messageId) PublicMessageDTO
    }

    class PublicServerController {
        +getPublicServerInfo(serverSlug) PublicServerDTO
        +getPublicChannelList(serverSlug) PublicChannelDTO[]
        +getServerLandingPage(serverSlug) ServerLandingPage
    }

    class SEOController {
        +getServerSitemap(serverSlug) SitemapXML
        +getRobotsTxt() RobotsTxt
    }

    ChannelController ..> ChannelVisibilityService : uses
    ChannelController ..> PermissionService : uses
    ChannelController ..> ChannelRepository : uses
    PublicChannelController ..> VisibilityGuard : uses
    PublicChannelController ..> MessageService : uses
    PublicChannelController ..> SEOService : uses
    PublicServerController ..> ServerRepository : uses
    SEOController ..> IndexingService : uses

    class ChannelVisibilityService { }
    class PermissionService { }
    class VisibilityGuard { }
    class MessageService { }
    class SEOService { }
    class ServerRepository { }
    class ChannelRepository { }
    class IndexingService { }
```

### 3.5 Visibility & Access Control (M-B2, M-B3)

```mermaid
classDiagram
    class ChannelVisibilityService {
        -channelRepository: ChannelRepository
        -auditLogger: AuditLogService
        -eventBus: EventBus
        -permissionService: PermissionService
        +setVisibility() VisibilityChangeResult
        +getVisibility() ChannelVisibility
        +canChangeVisibility() boolean
        -validateTransition() ValidationResult
        -emitVisibilityChange() void
    }

    class PermissionService {
        +canManageChannel(userId, channelId) boolean
        +isServerAdmin(userId, serverId) boolean
        +getEffectivePermissions(userId, channelId) PermissionSet
    }

    class AuditLogService {
        +logVisibilityChange(entry) void
        +getAuditHistory(channelId, options) AuditLogEntry[]
        +exportAuditLog(channelId, format) Buffer
    }

    class VisibilityGuard {
        -channelRepository: ChannelRepository
        -cacheService: CacheClient
        +isChannelPublic(channelId) boolean
        +isServerPublic(serverId) boolean
        +getVisibilityStatus(channelId) ChannelVisibility
    }

    class ContentFilter {
        -sensitivePatterns: RegExp[]
        +filterSensitiveContent(content) string
        +redactUserMentions(content) string
        +sanitizeForDisplay(html) string
        +sanitizeAttachments(attachments) Attachment[]
    }

    class RateLimiter {
        -windowMs: number
        -maxRequests: number
        +checkLimit(key) boolean
        +incrementCounter(key) void
        +isRateLimited(key) boolean
    }

    class AnonymousSessionManager {
        -sessionStore: CacheClient
        +createSession() string
        +getSession(sessionId) GuestSession
        +updatePreferences(sessionId, prefs) void
        +cleanupExpired() void
    }

    IVisibilityToggle <|.. ChannelVisibilityService
    ChannelVisibilityService --> PermissionService
    ChannelVisibilityService --> AuditLogService
    ChannelVisibilityService --> ChannelRepository
    AuditLogService --> AuditLogRepository
    VisibilityGuard --> ChannelRepository

    class IVisibilityToggle { }
    class ChannelRepository { }
    class AuditLogRepository { }
```

### 3.6 Content, Meta Tags & SEO (M-B4, M-B5, M-B6)

```mermaid
classDiagram
    class MessageService {
        -messageRepository: MessageRepository
        -contentFilter: ContentFilter
        +getMessagesForPublicView(channelId, page) PublicMessageDTO[]
        +getMessageById(messageId) PublicMessageDTO
        +buildMessageDTO(message) PublicMessageDTO
    }

    class AuthorService {
        -userRepository: UserRepository
        +getPublicAuthorInfo(userId) PublicAuthorDTO
        +anonymizeAuthor(user) PublicAuthorDTO
        +getDisplayName(user) string
    }

    class AttachmentService {
        -storageClient: StorageClient
        +getPublicAttachmentUrl(attachmentId) string
        +generateThumbnail(attachment) string
        +isAttachmentPublic(attachment) boolean
    }

    class MetaTagService {
        +generateMetaTags(channelId) MetaTagSet
        +getOrGenerateCached(channelId) MetaTagSet
        +invalidateCache(channelId) void
        +scheduleRegeneration(channelId) void
    }

    class ContentAnalyzer {
        +analyzeThread(channelId) ContentAnalysis
        +getTopicCategory(messages) string
    }

    class IndexingService {
        -sitemapGenerator: SitemapGenerator
        +updateSitemap(serverId) void
        +notifySearchEngines(url, action) NotificationResult
        +generateCanonicalUrl(serverId, channelId) string
        +getRobotsDirectives(visibility) RobotsDirectives
    }

    class SitemapGenerator {
        -publicChannelRepo: ChannelRepository
        +generate(serverId) SitemapXML
        +getLastModified(serverId) DateTime
    }

    class SEOService {
        +generatePageTitle(channel, server) string
        +generateDescription(channel, messages) string
        +generateStructuredData(channel, messages) JSON
        +generateBreadcrumbs(server, channel) JSON
        +getCanonicalUrl(server, channel) string
    }

    IMetaTagGenerator <|.. MetaTagService
    MessageService --> ContentFilter
    MetaTagService --> ContentAnalyzer
    MetaTagService --> MetaTagRepository
    MetaTagService --> ChannelRepository
    IndexingService --> SitemapGenerator
    SitemapGenerator --> ChannelRepository
    AuthorService --> UserRepository
    SEOService --> ChannelRepository
    SEOService --> MessageRepository

    class IMetaTagGenerator { }
    class ContentFilter { }
    class MetaTagRepository { }
    class ChannelRepository { }
    class UserRepository { }
    class MessageRepository { }
```

### 3.7 Repositories (M-D1)

```mermaid
classDiagram
    class ChannelRepository {
        +findById(channelId) Channel
        +findBySlug(serverSlug, channelSlug) Channel
        +update(channelId, data) Channel
        +findPublicByServerId(serverId) Channel[]
        +getVisibility(channelId) ChannelVisibility
        +getMetadata(channelId) ChannelMetadata
        -invalidateCache(channelId) void
        -getCacheKey(channelId) string
    }

    class MessageRepository {
        +findByChannelPaginated(channelId, page, limit) Message[]
        +findById(messageId) Message
        +countByChannel(channelId) number
    }

    class ServerRepository {
        +findBySlug(slug) Server
        +getPublicInfo(serverId) Server
    }

    class UserRepository {
        +findById(userId) User
        +getPublicProfile(userId) User
    }

    class AuditLogRepository {
        +create(entry) AuditLogEntry
        +findByChannelId(channelId, options) AuditLogEntry[]
        +findByDateRange(start, end) AuditLogEntry[]
    }

    class MetaTagRepository {
        +findByChannelId(channelId) GeneratedMetaTags
        +upsert(channelId, tags) GeneratedMetaTags
        +markForRegeneration(channelId) void
    }
```

> **Entity-to-DTO mapping:** Repositories always return domain entities (e.g. `Server`, `Channel`). The responsibility for mapping to public DTOs (e.g. `Server → PublicServerDTO`) belongs to the **controller layer**. No repository method should return a DTO directly.

### 3.8 Relationship Legend

| Symbol | Meaning |
|--------|---------|
| `<\|..` | Implements interface |
| `-->` | Depends on / uses |
| `"1" --> "*"` | One-to-many entity relationship |
| `"1" --> "0..1"` | One-to-zero-or-one entity relationship |

---

## 4. Unified Data Model

### 4.1 Database Schema (PostgreSQL)

```mermaid
erDiagram
    servers ||--o{ channels : "has"
    channels ||--o{ messages : "contains"
    channels ||--o{ visibility_audit_log : "tracks"
    channels ||--o| generated_meta_tags : "has"
    messages }o--|| users : "authored by"
    messages ||--o{ attachments : "has"

    servers {
        UUID id PK
        VARCHAR_100 name
        VARCHAR_100 slug UK
        TEXT description
        VARCHAR_500 icon_url
        BOOLEAN is_public
        INTEGER member_count
        TIMESTAMPTZ created_at
    }

    channels {
        UUID id PK
        UUID server_id FK
        VARCHAR_100 name
        VARCHAR_100 slug
        channel_type_enum channel_type
        visibility_enum visibility
        TEXT topic
        INTEGER position
        TIMESTAMPTZ indexed_at
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    messages {
        UUID id PK
        UUID channel_id FK
        UUID author_id FK
        TEXT content
        TIMESTAMPTZ created_at
        TIMESTAMPTZ edited_at
        BOOLEAN is_deleted
    }

    users {
        UUID id PK
        VARCHAR_32 username
        VARCHAR_100 display_name
        VARCHAR_500 avatar_url
        BOOLEAN public_profile
        TIMESTAMPTZ created_at
    }

    attachments {
        UUID id PK
        UUID message_id FK
        VARCHAR_255 filename
        VARCHAR_500 url
        VARCHAR_100 content_type
        BIGINT size_bytes
    }

    visibility_audit_log {
        UUID id PK
        UUID channel_id FK
        UUID actor_id FK
        VARCHAR_50 action
        JSONB old_value
        JSONB new_value
        TIMESTAMPTZ timestamp
        INET ip_address
        VARCHAR_500 user_agent
    }

    generated_meta_tags {
        UUID id PK
        UUID channel_id FK
        VARCHAR_120 title
        VARCHAR_320 description
        VARCHAR_120 og_title
        VARCHAR_320 og_description
        VARCHAR_500 og_image
        VARCHAR_20 twitter_card
        TEXT keywords
        JSONB structured_data
        VARCHAR_64 content_hash
        BOOLEAN needs_regeneration
        TIMESTAMPTZ generated_at
        INTEGER schema_version
    }
```

### 4.2 Enum Definition

```sql
CREATE TYPE visibility_enum AS ENUM ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE');
CREATE TYPE channel_type_enum AS ENUM ('TEXT', 'VOICE', 'ANNOUNCEMENT');
```

### 4.3 Index Strategy (Canonical Set)

All indexes below are the **authoritative, merged** set across all three feature specs:

```sql
-- Channels
CREATE INDEX idx_channels_server_visibility ON channels(server_id, visibility);
CREATE UNIQUE INDEX idx_channels_server_slug ON channels(server_id, slug);
CREATE INDEX idx_channels_visibility_indexed ON channels(visibility, indexed_at)
  WHERE visibility = 'PUBLIC_INDEXABLE';
CREATE INDEX idx_channels_visibility ON channels(visibility)
  WHERE visibility IN ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX');

-- Messages
CREATE INDEX idx_messages_channel_time ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_channel_not_deleted ON messages(channel_id, created_at DESC)
  WHERE is_deleted = FALSE;

-- Visibility Audit Log
CREATE INDEX idx_audit_channel_time ON visibility_audit_log(channel_id, timestamp DESC);
CREATE INDEX idx_audit_actor ON visibility_audit_log(actor_id, timestamp DESC);

-- Servers
CREATE UNIQUE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_public ON servers(is_public) WHERE is_public = TRUE;

-- Generated Meta Tags
CREATE UNIQUE INDEX idx_meta_tags_channel ON generated_meta_tags(channel_id);
CREATE INDEX idx_meta_tags_needs_regen ON generated_meta_tags(needs_regeneration)
  WHERE needs_regeneration = TRUE;
```

### 4.4 Cache Schemas (Redis)

| Key Pattern | Value Type | TTL | Owner Module | Invalidation Trigger |
|-------------|-----------|-----|--------------|---------------------|
| `channel:{channelId}:visibility` | String (enum) | 3600s | M-B3 | `VISIBILITY_CHANGED` event |
| `server:{serverId}:public_channels` | JSON (channel ID array) | 300s | M-B4 | `VISIBILITY_CHANGED` event |
| `channel:msgs:{channelId}:page:{pageNum}` | JSON (PublicMessageDTO[]) | 60s | M-B4 | `MESSAGE_CREATED/EDITED/DELETED` |
| `server:{serverId}:info` | JSON (PublicServerDTO) | 300s | M-B4 | Server update |
| `guest:session:{sessionId}` | JSON (preferences) | 86400s | M-B2 | Session expiry |
| `meta:channel:{channelId}` | JSON (MetaTagSet) | 3600s | M-B5 | `VISIBILITY_CHANGED`, `MESSAGE_*` |
| `analysis:channel:{channelId}` | JSON (ContentAnalysis) | 1800s | M-B5 | `MESSAGE_*` events |

### 4.5 Event Bus (Redis Pub/Sub)

```mermaid
graph LR
    subgraph Producers
        CVS["ChannelVisibilityService<br/>(M-B3)"]
        MsgSvc["Message System<br/>(future)"]
    end

    subgraph EventBus["Redis Pub/Sub"]
        VC["VISIBILITY_CHANGED"]
        MC["MESSAGE_CREATED"]
        ME["MESSAGE_EDITED"]
        MD["MESSAGE_DELETED"]
        MTU["META_TAGS_UPDATED"]
    end

    subgraph Consumers
        IdxSvc["IndexingService<br/>(M-B6)"]
        MetaSvc["MetaTagService<br/>(M-B5)"]
        CacheMgr["Cache Invalidator<br/>(M-D3)"]
        BgWorker["Event-Driven Workers<br/>(M-B7)"]
    end

    CVS --> VC
    MsgSvc --> MC
    MsgSvc --> ME
    MsgSvc --> MD
    MetaSvc --> MTU

    VC --> IdxSvc
    VC --> MetaSvc
    VC --> CacheMgr
    MC --> MetaSvc
    MC --> CacheMgr
    ME --> MetaSvc
    ME --> CacheMgr
    MD --> MetaSvc
    MD --> CacheMgr
    MTU --> BgWorker
```

| Event | Payload | Producer | Consumers |
|-------|---------|----------|-----------|
| `VISIBILITY_CHANGED` | `{ channelId, oldVisibility, newVisibility, actorId, timestamp }` | ChannelVisibilityService (M-B3) | IndexingService (M-B6), MetaTagService (M-B5), Cache Invalidator (M-D3) |
| `MESSAGE_CREATED` | `{ messageId, channelId, authorId, timestamp }` | Message System | MetaTagService (M-B5), Cache Invalidator (M-D3) |
| `MESSAGE_EDITED` | `{ messageId, channelId, timestamp }` | Message System | MetaTagService (M-B5), Cache Invalidator (M-D3) |
| `MESSAGE_DELETED` | `{ messageId, channelId, timestamp }` | Message System | MetaTagService (M-B5), Cache Invalidator (M-D3) |
| `META_TAGS_UPDATED` | `{ channelId, version, timestamp }` | MetaTagService (M-B5) | Background Workers (M-B7) for sitemap update |

---

## 5. Unified API Surface

### 5.1 Authenticated APIs (tRPC)

All tRPC procedures are mounted under `/trpc` and require a valid session.

#### tRPC Context

Every tRPC procedure receives a typed `TRPCContext` injected by `createContext` in `src/trpc/init.ts`:

```typescript
// src/trpc/init.ts
export interface TRPCContext {
  userId: string | null;   // null for unauthenticated requests
  ip: string;              // client IP for audit logging
}

// Context is populated from the Express session (or JWT middleware) at request time:
export function createContext({ req }: { req: Request }): TRPCContext {
  const session = (req as Request & { session?: { userId?: string } }).session;
  return { userId: session?.userId ?? null, ip: req.ip ?? '' };
}
```

`createContext` is passed to `createExpressMiddleware` in `src/app.ts` so every procedure
receives a populated context automatically.

#### Procedure base types

| Base | Guard | Usage |
|------|-------|-------|
| `publicProcedure` | none | Health checks, unauthenticated queries |
| `authedProcedure` | throws `UNAUTHORIZED` if `ctx.userId` is null | All admin/visibility/meta-tag procedures |

`authedProcedure` narrows `ctx.userId` to `string` (non-null) for downstream handlers, so
`PermissionService.isServerAdmin(ctx.userId, channelId)` and `AuditLogService` can safely
read `ctx.userId` and `ctx.ip` without additional null checks.

```mermaid
graph LR
    subgraph tRPC["tRPC Router (/trpc)"]
        direction TB
        CB["channel.getBySlug"]
        CS["channel.getSettings"]
        CV["channel.updateVisibility"]
        CA["channel.getAuditLog"]
        MG["admin.getMetaTags"]
        MU["admin.updateMetaTags"]
        MR["admin.regenerateMetaTags"]
    end

    AdminClient["Admin Client<br/>(Next.js)"] --> tRPC
```

| Procedure | Input | Output | Feature |
|-----------|-------|--------|---------|
| `channel.getBySlug` | `{ serverSlug: string, channelSlug: string }` | `ChannelSettingsResponse` | Channel Visibility Toggle |
| `channel.getSettings` | `{ channelId: UUID }` | `ChannelSettingsResponse` | Channel Visibility Toggle |
| `channel.updateVisibility` | `{ channelId: UUID, visibility: ChannelVisibility }` | `VisibilityUpdateResponse` | Channel Visibility Toggle |
| `channel.getAuditLog` | `{ channelId: UUID, limit?, offset?, startDate? }` | `AuditLogResponse` | Channel Visibility Toggle |
| `admin.getMetaTags` | `{ channelId: UUID }` | `MetaTagSet` | SEO Meta Tag Generation |
| `admin.updateMetaTags` | `{ channelId: UUID, overrides: Partial<MetaTagSet> }` | `MetaTagSet` | SEO Meta Tag Generation |
| `admin.regenerateMetaTags` | `{ channelId: UUID }` | `{ jobId: string }` | SEO Meta Tag Generation |

> **Channel identity note:** The `VisibilityToggle` frontend component receives `serverSlug` + `channelSlug` from the URL. The settings page calls `channel.getBySlug({ serverSlug, channelSlug })` which returns `ChannelSettingsResponse` (including `channelId: UUID`). The settings page then passes that UUID as a prop to `VisibilityToggle`. All subsequent operations (`channel.updateVisibility`, `channel.getAuditLog`) use the UUID directly. The slug→UUID resolution happens exactly once at settings-page load.

### 5.2 Public APIs (REST)

All REST endpoints are unauthenticated. Rate limiting applies.

> **Cache TTL column:** values refer to `Cache-Control: public, max-age=N` HTTP response headers sent by the backend, instructing any downstream HTTP cache (browser, proxy) how long to cache the response. Redis caches page data separately with the same TTL; see §4.4.

| Method | Path | Handler | Feature | Cache TTL |
|--------|------|---------|---------|-----------|
| GET | `/c/{serverSlug}/{channelSlug}` | `PublicChannelController.getPublicChannelPage` | Guest Public Channel View | 60s |
| GET | `/api/public/channels/{channelId}/messages` | `PublicChannelController.getPublicMessages` | Guest Public Channel View | 60s |
| GET | `/api/public/channels/{channelId}/messages/{messageId}` | `PublicChannelController.getPublicMessage` | Guest Public Channel View | 60s |
| GET | `/api/public/servers/{serverSlug}` | `PublicServerController.getPublicServerInfo` | Guest Public Channel View | 300s |
| GET | `/api/public/servers/{serverSlug}/channels` | `PublicServerController.getPublicChannelList` | Guest Public Channel View | 300s |
| GET | `/s/{serverSlug}` | `PublicServerController.getServerLandingPage` | Guest Public Channel View | 300s |
| GET | `/sitemap/{serverSlug}.xml` | `SEOController.getServerSitemap` | Channel Visibility Toggle | 3600s |
| GET | `/robots.txt` | `SEOController.getRobotsTxt` | Channel Visibility Toggle | 86400s |

### 5.3 Rate Limiting

| Consumer Type | Limit | Window | Scope |
|---------------|-------|--------|-------|
| Authenticated users | 100 req | 1 min | Per user |
| Guest users (anonymous) | 60 req | 1 min | Per IP |
| Verified bots (Googlebot, Bingbot) | 1000 req | 1 min | Per bot identity |

Exceeding limits returns `429 Too Many Requests` with a `Retry-After` header.

---

## 6. Per-Module Specifications

### 6.1 M-B1: API Gateway

**Purpose:** Single entry point for all backend requests. Routes authenticated traffic through tRPC and public traffic through REST controllers.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB1["M-B1 API Gateway"]
        tRPCRouter["tRPC Router<br/>(authenticated)"]
        RESTRouter["REST Router<br/>(public)"]

        CC["ChannelController"]
        PCC["PublicChannelController"]
        PSC["PublicServerController"]
        SC["SEOController"]

        tRPCRouter --> CC
        RESTRouter --> PCC
        RESTRouter --> PSC
        RESTRouter --> SC
    end

    Middleware["Express Middleware<br/>CORS · Helmet · RateLimit"] --> MB1
```

**Classes:**

| Label | Class | Visibility | Methods |
|-------|-------|------------|---------|
| CL-C-B1.1 | ChannelController | Public | `getChannelBySlug()`, `getChannelSettings()`, `updateChannelVisibility()`, `getVisibilityAuditLog()` |
| CL-C-B1.2 | PublicChannelController | Public | `getPublicChannelPage()`, `getPublicMessages()`, `getPublicMessage()` |
| CL-C-B1.3 | PublicServerController | Public | `getPublicServerInfo()`, `getPublicChannelList()`, `getServerLandingPage()` |
| CL-C-B1.4 | SEOController | Public | `getServerSitemap()`, `getRobotsTxt()` |

### 6.2 M-B2: Access Control

**Purpose:** Guards every public request: checks channel/server visibility, filters sensitive content from public output, enforces rate limits, and manages anonymous guest sessions.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB2["M-B2 Access Control"]
        VG["VisibilityGuard"]
        CF["ContentFilter"]
        RL["RateLimiter"]
        ASM["AnonymousSessionManager"]
    end

    VG -->|reads| Redis[("Redis Cache")]
    VG -->|fallback| PG[("PostgreSQL")]
    RL -->|counters| Redis
    ASM -->|sessions| Redis
```

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B2.1 | VisibilityGuard | Public | Fast visibility checks (cache-first, DB fallback) |
| CL-C-B2.2 | ContentFilter | Public | Strips PII, redacts mentions, sanitizes HTML via sanitize-html |
| CL-C-B2.3 | RateLimiter | Public | Sliding-window rate limiting per IP/user/bot |
| CL-C-B2.4 | AnonymousSessionManager | Public | Cookie-based guest session with preferences |

### 6.3 M-B3: Visibility Management

**Purpose:** Owns the visibility state machine for channels. Only admins can toggle visibility. Every change is audited and emits an event to downstream consumers.

**Implementation requirements:**
- `setVisibility()` **must** wrap the `UPDATE channels` and `INSERT INTO visibility_audit_log` writes in a single Prisma transaction — if the audit insert fails, the visibility update must roll back.
- When transitioning to `PUBLIC_INDEXABLE`, `setVisibility()` also sets `indexed_at = NOW()` on the channel row (within the same transaction), recording the intent-to-index timestamp. This does not confirm the page has been crawled; it marks when the channel became indexable.
- The controller layer (`ChannelController`) is responsible for mapping domain entities returned by services into response DTOs (`ChannelSettingsResponse`, `VisibilityUpdateResponse`) before sending them to the client. Repositories return domain entities only.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB3["M-B3 Visibility Management"]
        CVS["ChannelVisibilityService"]
        PS["PermissionService"]
        ALS["AuditLogService"]
    end

    CVS -->|checks| PS
    CVS -->|logs| ALS
    CVS -->|emits| EventBus["Redis Pub/Sub<br/>VISIBILITY_CHANGED"]
    CVS -->|reads/writes| ChannelRepo["ChannelRepository"]
    ALS -->|writes| AuditRepo["AuditLogRepository"]
```

**State Machine:**

```mermaid
stateDiagram-v2
    [*] --> PRIVATE : Channel created
    PRIVATE --> PUBLIC_INDEXABLE : Admin toggles public+indexable
    PRIVATE --> PUBLIC_NO_INDEX : Admin toggles public only
    PUBLIC_INDEXABLE --> PRIVATE : Admin toggles private
    PUBLIC_INDEXABLE --> PUBLIC_NO_INDEX : Admin disables indexing
    PUBLIC_NO_INDEX --> PRIVATE : Admin toggles private
    PUBLIC_NO_INDEX --> PUBLIC_INDEXABLE : Admin enables indexing
```

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B3.1 | ChannelVisibilityService | Public | Implements `IVisibilityToggle`; state transitions, validation, event emission |
| CL-C-B3.2 | PermissionService | Public | Checks admin/owner permissions before visibility changes |
| CL-C-B3.3 | AuditLogService | Public | Writes audit trail; queryable history; CSV/JSON export |

### 6.4 M-B4: Content Delivery

**Purpose:** Retrieves and formats channel content for public consumption. Handles author privacy (anonymization of opted-out users), attachment URL generation, and message pagination.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB4["M-B4 Content Delivery"]
        MS["MessageService"]
        AS["AuthorService"]
        ATS["AttachmentService"]
    end

    MS -->|reads| MsgRepo["MessageRepository"]
    MS -->|filters| CF["ContentFilter (M-B2)"]
    AS -->|reads| UserRepo["UserRepository"]
    ATS -->|reads| Storage["Object Storage (S3-compatible)"]
```

> **StorageClient** is an S3-compatible object storage adapter (e.g. AWS S3, MinIO). It is injected into `AttachmentService` and is not part of the application codebase — configure via `STORAGE_BUCKET`, `STORAGE_ENDPOINT`, and `STORAGE_KEY` environment variables.

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B4.1 | MessageService | Public | Paginated message retrieval with content filtering |
| CL-C-B4.2 | AuthorService | Public | Author display names with privacy-respecting anonymization |
| CL-C-B4.3 | AttachmentService | Public | Public attachment URLs; thumbnail generation |

### 6.5 M-B5: Meta Tag Engine

**Purpose:** Generates SEO meta tags (title, description, OpenGraph, Twitter Card, JSON-LD structured data) for public channel pages. Uses NLP-based content analysis for keyword extraction and summarization.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB5["M-B5 Meta Tag Engine"]
        MTS["MetaTagService<br/>(Facade)"]
        TG["TitleGenerator"]
        DG["DescriptionGenerator"]
        OGG["OpenGraphGenerator"]
        SDG["StructuredDataGenerator"]
        MTC["MetaTagCache"]
        CA["ContentAnalyzer"]
        KE["KeywordExtractor"]
        TS["TextSummarizer"]
    end

    MTS --> TG
    MTS --> DG
    MTS --> OGG
    MTS --> SDG
    MTS --> MTC
    MTS --> CA
    CA --> KE
    CA --> TS
    MTS -->|reads| ChannelRepo["ChannelRepository"]
    MTS -->|reads/writes| MTRepo["MetaTagRepository"]
    MTC -->|cache| Redis[("Redis")]
```

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B5.1 | MetaTagService | Public | Facade: orchestrates tag generation, caching, scheduling |
| CL-C-B5.2 | TitleGenerator | Internal | SEO-optimized titles from channel/message content |
| CL-C-B5.3 | DescriptionGenerator | Internal | Meta descriptions from message summarization |
| CL-C-B5.4 | OpenGraphGenerator | Internal | OG and Twitter Card tags |
| CL-C-B5.5 | StructuredDataGenerator | Internal | JSON-LD structured data (DiscussionForumPosting schema) |
| CL-C-B5.6 | MetaTagCache | Internal | Redis-backed cache for generated tags |
| CL-C-B5.7 | ContentAnalyzer | Public | NLP analysis: keywords, topics, summarization |
| CL-C-B5.8 | KeywordExtractor | Internal | TF-IDF keyword extraction via `natural` library |
| CL-C-B5.9 | TextSummarizer | Internal | Extractive summarization via `compromise` |

### 6.6 M-B6: SEO & Indexing

**Purpose:** Canonical owner of sitemap generation, `robots.txt` directives, canonical URLs, and search engine notification. Consumes `VISIBILITY_CHANGED` events to trigger sitemap rebuilds and indexing/de-indexing requests. When a channel transitions to `PRIVATE` or `PUBLIC_NO_INDEX`, `IndexingService` also clears the `indexed_at` field (sets it to `NULL`) in the same DB write; the initial `indexed_at` timestamp when transitioning to `PUBLIC_INDEXABLE` is set by `ChannelVisibilityService` (§6.3).

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB6["M-B6 SEO & Indexing"]
        IS["IndexingService"]
        SG["SitemapGenerator"]
        SEOS["SEOService"]
    end

    IS --> SG
    SG -->|reads| ChannelRepo["ChannelRepository"]
    IS -->|notifies| Google["Google Search Console"]
    IS -->|notifies| Bing["Bing Webmaster API"]
    SEOS -->|reads| ChannelRepo
    SEOS -->|reads| MsgRepo["MessageRepository"]
```

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B6.1 | IndexingService | Public | Sitemap updates; search engine ping; canonical URLs; robots directives |
| CL-C-B6.2 | SitemapGenerator | Internal | Builds XML sitemaps from public channel data |
| CL-C-B6.3 | SEOService | Public | Page titles, descriptions, breadcrumbs, canonical URLs for SSR |

### 6.7 M-B7: Background Workers

**Purpose:** Handles asynchronous, potentially expensive operations: meta-tag regeneration, sitemap rebuilds, and search engine notification. Workers subscribe to Redis Pub/Sub events and process them asynchronously.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MB7["M-B7 Background Workers"]
        MTUW["MetaTagUpdateWorker"]
        EL["EventListener"]
        SU["SitemapUpdater"]
    end

    EL -->|subscribes| EventBus["Redis Pub/Sub"]
    EL -->|dispatches| MTUW
    EL -->|dispatches| SU
    MTUW -->|calls| MetaSvc["MetaTagService (M-B5)"]
    SU -->|calls| IdxSvc["IndexingService (M-B6)"]
```

**Classes:**

| Label | Class | Visibility | Purpose |
|-------|-------|------------|---------|
| CL-C-B7.1 | MetaTagUpdateWorker | Internal | Processes meta-tag regeneration on event |
| CL-C-B7.2 | EventListener | Internal | Subscribes to Redis Pub/Sub; dispatches to workers |
| CL-C-B7.3 | SitemapUpdater | Internal | Processes sitemap rebuild + search engine notification on event |

### 6.8 M-D1: Data Access (Repositories)

**Purpose:** Provides a clean data abstraction layer over PostgreSQL (via Prisma) and Redis. All database queries are centralized here; no service directly accesses the database.

| Label | Class | Methods | Used By |
|-------|-------|---------|---------|
| CL-C-D1.1 | ChannelRepository | `findById`, `findBySlug`, `update`, `findPublicByServerId`, `getVisibility`, `getMetadata` | M-B3, M-B5, M-B6, M-B2 |
| CL-C-D1.2 | MessageRepository | `findByChannelPaginated`, `findById`, `countByChannel` | M-B4, M-B5 |
| CL-C-D1.3 | ServerRepository | `findBySlug`, `getPublicInfo` | M-B1 (PublicServerController) |
| CL-C-D1.4 | UserRepository | `findById`, `getPublicProfile` | M-B4 (AuthorService) |
| CL-C-D1.5 | AuditLogRepository | `create`, `findByChannelId`, `findByDateRange` | M-B3 (AuditLogService) |
| CL-C-D1.6 | MetaTagRepository | `findByChannelId`, `upsert`, `markForRegeneration` | M-B5 (MetaTagService) |

### 6.9 M-D2: Persistence (PostgreSQL)

**Purpose:** Owns all database table definitions, migrations, and enum types. Implemented as a Prisma schema that generates type-safe client code consumed by M-D1 repositories.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MD2["M-D2 Persistence"]
        Schema["Prisma Schema<br/>(schema.prisma)"]
        Migrations["Prisma Migrations"]
        EnumDef["visibility_enum<br/>PUBLIC_INDEXABLE · PUBLIC_NO_INDEX · PRIVATE"]
    end

    Schema --> Migrations
    Schema --> EnumDef
    Repos["M-D1 Repositories"] -->|generated client| Schema
    Schema -->|DDL| PG[("PostgreSQL 16+")]
```

**Tables Managed:** `servers`, `channels`, `messages`, `users`, `attachments`, `visibility_audit_log`, `generated_meta_tags` (see §4 for full column definitions).

### 6.10 M-D3: Cache & EventBus (Redis)

**Purpose:** Manages all Redis cache keys, TTL policies, cache invalidation logic, and the Pub/Sub event bus transport. Provides a unified `CacheClient` and `EventBus` abstraction consumed by all service modules.

**Internal Architecture:**

```mermaid
graph TB
    subgraph MD3["M-D3 Cache & EventBus"]
        CC["CacheClient"]
        EB["EventBus<br/>(Pub/Sub)"]
        CI["CacheInvalidator"]
    end

    CC -->|GET/SET/DEL| Redis[("Redis 7.2+")]
    EB -->|PUBLISH/SUBSCRIBE| Redis
    CI -->|subscribes| EB
    CI -->|invalidates| CC

    Services["M-B2 through M-B7"] --> CC
    Services --> EB
```

**Cache Key Ownership:** See §4.4 for the complete cache schema table with key patterns, TTLs, and invalidation triggers.

---

## 7. Cross-Feature Integration

### 7.1 Visibility Change Propagation

When an admin changes a channel's visibility, the system propagates the change across all features:

```mermaid
sequenceDiagram
    participant Admin
    participant ChannelController as M-B1: ChannelController
    participant VisService as M-B3: VisibilityService
    participant DB as PostgreSQL
    participant EventBus as Redis Pub/Sub
    participant IndexSvc as M-B6: IndexingService
    participant MetaSvc as M-B5: MetaTagService
    participant CacheInv as M-D3: Cache Invalidator

    Admin->>ChannelController: updateVisibility(channelId, PUBLIC_INDEXABLE)
    ChannelController->>VisService: setVisibility(channelId, PUBLIC_INDEXABLE, actorId, ip)
    rect rgb(200, 230, 200)
        note over VisService,DB: Prisma $transaction — atomic<br/>rolls back both on failure
        VisService->>DB: UPDATE channels SET visibility = 'PUBLIC_INDEXABLE'
        VisService->>DB: INSERT INTO visibility_audit_log
    end
    VisService->>EventBus: publish VISIBILITY_CHANGED

    par Parallel Event Processing
        EventBus->>IndexSvc: VISIBILITY_CHANGED
        IndexSvc->>DB: Rebuild sitemap for server
        IndexSvc->>IndexSvc: Notify Google/Bing

        EventBus->>MetaSvc: VISIBILITY_CHANGED
        MetaSvc->>MetaSvc: Generate meta tags for channel

        EventBus->>CacheInv: VISIBILITY_CHANGED
        CacheInv->>CacheInv: Invalidate visibility cache
        CacheInv->>CacheInv: Invalidate public channel list
    end
```

### 7.2 Guest Page Load (Cache Miss)

```mermaid
sequenceDiagram
    participant Guest
    participant SSR as Next.js SSR (M-GV1)
    participant PCC as M-B1: PublicChannelController
    participant VG as M-B2: VisibilityGuard
    participant MS as M-B4: MessageService
    participant SEO as M-B6: SEOService
    participant MTS as M-B5: MetaTagService
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    Guest->>SSR: GET /c/gamedev/help

    SSR->>PCC: getPublicChannelPage("gamedev", "help")
    PCC->>VG: isChannelPublic(channelId)
    VG->>Redis: GET channel:{id}:visibility
    Redis-->>VG: PUBLIC_INDEXABLE

    PCC->>MS: getMessagesForPublicView(channelId, page=1)
    MS->>DB: SELECT messages WHERE channel_id AND NOT is_deleted
    DB-->>MS: Message[]
    MS->>MS: Filter sensitive content

    PCC->>MTS: getOrGenerateCached(channelId)
    MTS->>Redis: GET meta:channel:{id}
    Redis-->>MTS: MetaTagSet (cached)

    PCC->>SEO: generateBreadcrumbs(server, channel)

    PCC-->>SSR: PublicChannelPage data
    SSR->>SSR: Render HTML with meta tags
    SSR-->>Guest: HTML Response
```

---

## 8. Technology Stack (Unified)

| Label | Technology | Version | Purpose | Used By |
|-------|------------|---------|---------|---------|
| T1 | TypeScript | 5.3+ | Primary language | All |
| T2 | React | 18.2+ | Frontend UI framework | M-CV1, M-CV2, M-GV1 |
| T3 | Next.js | 14.0+ | SSR framework | M-GV1, M-CV2 |
| T4 | Node.js | 20 LTS | Server runtime | All backend |
| T5 | PostgreSQL | 16+ | Primary database | M-D2 |
| T6 | Redis | 7.2+ | Cache, Pub/Sub EventBus, sessions | M-D3, M-B7 |
| T7 | Prisma | 5.8+ | Type-safe ORM | M-D1 |
| T8 | tRPC | 11+ | Authenticated type-safe APIs | M-B1 |
| T9 | Zod | 3.22+ | Runtime schema validation | All API layers |
| T10 | TailwindCSS | 3.4+ | Utility-first CSS | M-CV1, M-GV1 |
| T11 | Docker | 24+ | Containerization | Deployment |
| T12 | Google Search Console API | v1 | Programmatic indexing/de-indexing | M-B6 |
| T13 | Bing Webmaster API | v1 | Microsoft search engine integration | M-B6 |
| T14 | Jest | 29+ | Unit/integration testing | All |
| T15 | Playwright | 1.40+ | E2E testing | All |
| T16 | sanitize-html | 2.12+ | HTML sanitization (XSS prevention, Node.js-native) | M-B2, M-B5 |
| T17 | natural | 6.0+ | NLP keyword extraction | M-B5 |
| T18 | compromise | 14.0+ | NLP text parsing/summarization | M-B5 |
| T19 | schema-dts | 1.1+ | Typed JSON-LD structured data | M-B5, M-B6 |
| T20 | sharp | 0.33+ | Image processing/thumbnails | M-B4 |
| T21 | intersection-observer | polyfill | Infinite scroll (client) | M-GV2 |
| T22 | Lighthouse CI | 11+ | Performance testing | CI/CD |

---

## 9. Security Considerations

### 9.1 Content Filtering Pipeline

All user-generated content passes through `ContentFilter` (M-B2) before public rendering:

1. **sanitize-html** strips all script tags and event handlers (Node.js-native; no DOM dependency)
2. **Mention redaction** replaces `@username` with `@user` to protect identities
3. **PII detection** regex-based removal of email addresses, phone numbers
4. **Attachment filtering** removes non-public attachments from responses

### 9.2 Privacy Controls

- Users with `public_profile = false` are displayed as "Anonymous" with no avatar
- User database IDs are never exposed in public API responses
- Guest sessions use opaque session IDs; no PII is stored

### 9.3 Rate Limiting & Bot Protection

- Application-level sliding-window rate limiting (see §5.3)
- Express rate-limit middleware for per-IP throttling
- Verified bot allowlist: Googlebot, Bingbot, Slackbot (by User-Agent + reverse DNS)

### 9.4 Security Headers

All responses include:
- `Content-Security-Policy` — restricts script sources
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000`
- `X-Robots-Tag` — dynamic per visibility (`index,follow` / `noindex,follow` / absent for private)

---

## 10. Mapping to Feature Specs

This section maps the unified backend modules back to the class labels used in each individual dev spec, providing a crosswalk for developers.

### 10.1 Channel Visibility Toggle Spec → Unified Backend

| Original Spec Label | Original Class | Unified Module | Unified Label |
|---------------------|----------------|----------------|---------------|
| CL-C4.1 | ChannelController | M-B1 | CL-C-B1.1 |
| CL-C4.2 | PublicAccessController | M-B1 | CL-C-B1.2 + CL-C-B1.4 |
| CL-C5.1 | ChannelVisibilityService | M-B3 | CL-C-B3.1 |
| CL-C5.2 | IndexingService | M-B6 | CL-C-B6.1 |
| CL-C5.3 | PermissionService | M-B3 | CL-C-B3.2 |
| CL-C5.4 | AuditLogService | M-B3 | CL-C-B3.3 |
| CL-C6.1 | ChannelRepository | M-D1 | CL-C-D1.1 |
| CL-C6.2 | AuditLogRepository | M-D1 | CL-C-D1.5 |

### 10.2 Guest Public Channel View Spec → Unified Backend

| Original Spec Label | Original Class | Unified Module | Unified Label |
|---------------------|----------------|----------------|---------------|
| CL-C3.1 | PublicChannelController | M-B1 | CL-C-B1.2 |
| CL-C3.2 | PublicServerController | M-B1 | CL-C-B1.3 |
| CL-C4.1 | VisibilityGuard | M-B2 | CL-C-B2.1 |
| CL-C4.2 | ContentFilter | M-B2 | CL-C-B2.2 |
| CL-C4.3 | RateLimiter | M-B2 | CL-C-B2.3 |
| CL-C4.4 | AnonymousSessionManager | M-B2 | CL-C-B2.4 |
| CL-C5.1 | MessageService | M-B4 | CL-C-B4.1 |
| CL-C5.2 | AuthorService | M-B4 | CL-C-B4.2 |
| CL-C5.3 | AttachmentService | M-B4 | CL-C-B4.3 |
| CL-C5.4 | SEOService | M-B6 | CL-C-B6.3 |
| CL-C6.1 | ChannelRepository | M-D1 | CL-C-D1.1 |
| CL-C6.2 | MessageRepository | M-D1 | CL-C-D1.2 |
| CL-C6.3 | ServerRepository | M-D1 | CL-C-D1.3 |
| CL-C6.4 | UserRepository | M-D1 | CL-C-D1.4 |

### 10.3 SEO Meta Tag Generation Spec → Unified Backend

| Original Spec Label | Original Class | Unified Module | Unified Label |
|---------------------|----------------|----------------|---------------|
| CL-C2.1 | MetaTagService | M-B5 | CL-C-B5.1 |
| CL-C2.2 | TitleGenerator | M-B5 | CL-C-B5.2 |
| CL-C2.3 | DescriptionGenerator | M-B5 | CL-C-B5.3 |
| CL-C2.4 | OpenGraphGenerator | M-B5 | CL-C-B5.4 |
| CL-C2.5 | StructuredDataGenerator | M-B5 | CL-C-B5.5 |
| CL-C2.6 | MetaTagCache | M-B5 | CL-C-B5.6 |
| CL-C3.1 | ContentAnalyzer | M-B5 | CL-C-B5.7 |
| CL-C3.2 | KeywordExtractor | M-B5 | CL-C-B5.8 |
| CL-C3.3 | TextSummarizer | M-B5 | CL-C-B5.9 |
| CL-C3.4 | TopicClassifier | M-B5 | CL-C-B5.7 (consolidated into ContentAnalyzer) |
| CL-C4.1 | MetaTagUpdateWorker | M-B7 | CL-C-B7.1 |
| CL-C4.2 | EventListener | M-B7 | CL-C-B7.2 |
| CL-C4.3 | SitemapUpdater | M-B7 | CL-C-B7.3 |
| CL-C5.1 | ChannelRepository | M-D1 | CL-C-D1.1 |
| CL-C5.2 | MessageRepository | M-D1 | CL-C-D1.2 |
| CL-C5.3 | MetaTagRepository | M-D1 | CL-C-D1.6 |

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **PUBLIC_INDEXABLE** | Channel is publicly visible and should appear in search engine results |
| **PUBLIC_NO_INDEX** | Channel is publicly visible but has `noindex` robots directive |
| **PRIVATE** | Channel is not publicly accessible; requires authentication |
| **SSR** | Server-Side Rendering — HTML generated on the server for SEO |
| **tRPC** | TypeScript Remote Procedure Call — type-safe API framework |
| **EventBus** | Redis Pub/Sub messaging system for cross-module communication |
| **Event-Driven Workers** | Redis Pub/Sub subscribers that process background tasks asynchronously |
| **Prisma** | Type-safe ORM for PostgreSQL |

## Appendix B: File Structure (Planned)

```
harmony-backend/
├── src/
│   ├── index.ts                    # Server entry point
│   ├── app.ts                      # Express app factory
│   ├── lambda.ts                   # AWS Lambda wrapper
│   ├── middleware/
│   │   ├── cors.ts
│   │   ├── rateLimiter.ts          # M-B2: RateLimiter
│   │   └── helmet.ts
│   ├── trpc/
│   │   ├── init.ts
│   │   ├── router.ts               # Root tRPC router
│   │   ├── channel.router.ts       # M-B1: ChannelController procedures
│   │   └── admin.router.ts         # M-B1: Admin meta-tag procedures
│   ├── controllers/
│   │   ├── publicChannel.ctrl.ts   # M-B1: PublicChannelController
│   │   ├── publicServer.ctrl.ts    # M-B1: PublicServerController
│   │   └── seo.ctrl.ts             # M-B1: SEOController
│   ├── services/
│   │   ├── visibility.service.ts   # M-B3: ChannelVisibilityService
│   │   ├── permission.service.ts   # M-B3: PermissionService
│   │   ├── auditLog.service.ts     # M-B3: AuditLogService
│   │   ├── message.service.ts      # M-B4: MessageService
│   │   ├── author.service.ts       # M-B4: AuthorService
│   │   ├── attachment.service.ts   # M-B4: AttachmentService
│   │   ├── metaTag.service.ts      # M-B5: MetaTagService
│   │   ├── contentAnalyzer.ts      # M-B5: ContentAnalyzer
│   │   ├── indexing.service.ts     # M-B6: IndexingService
│   │   └── seo.service.ts          # M-B6: SEOService
│   ├── guards/
│   │   ├── visibilityGuard.ts      # M-B2: VisibilityGuard
│   │   ├── contentFilter.ts        # M-B2: ContentFilter
│   │   └── anonymousSession.ts     # M-B2: AnonymousSessionManager
│   ├── workers/
│   │   ├── metaTagUpdate.worker.ts # M-B7: MetaTagUpdateWorker
│   │   ├── eventListener.ts        # M-B7: EventListener
│   │   └── sitemapUpdater.ts       # M-B7: SitemapUpdater
│   ├── repositories/
│   │   ├── channel.repo.ts         # M-D1: ChannelRepository
│   │   ├── message.repo.ts         # M-D1: MessageRepository
│   │   ├── server.repo.ts          # M-D1: ServerRepository
│   │   ├── user.repo.ts            # M-D1: UserRepository
│   │   ├── auditLog.repo.ts        # M-D1: AuditLogRepository
│   │   └── metaTag.repo.ts         # M-D1: MetaTagRepository
│   ├── entities/
│   │   ├── channel.entity.ts
│   │   ├── message.entity.ts
│   │   ├── server.entity.ts
│   │   ├── user.entity.ts
│   │   ├── attachment.entity.ts
│   │   └── auditLogEntry.entity.ts
│   ├── dto/
│   │   ├── publicChannel.dto.ts
│   │   ├── publicMessage.dto.ts
│   │   ├── publicAuthor.dto.ts
│   │   ├── publicServer.dto.ts
│   │   ├── visibilityUpdate.dto.ts
│   │   └── metaTagSet.dto.ts
│   └── events/
│       ├── eventBus.ts             # Redis Pub/Sub wrapper
│       └── eventTypes.ts           # Event type definitions
├── prisma/
│   └── schema.prisma               # M-D2: Database schema
└── tests/
```

## Appendix C: References

- [Channel Visibility Toggle Dev Spec](./dev-spec-channel-visibility-toggle.md)
- [Guest Public Channel View Dev Spec](./dev-spec-guest-public-channel-view.md)
- [SEO Meta Tag Generation Dev Spec](./dev-spec-seo-meta-tag-generation.md)
