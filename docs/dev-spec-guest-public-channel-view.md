# Development Specification: Guest Public Channel View

## Feature: Anonymous Access to Public Channel Content

**User Story:** As a Guest User (Searcher), I want to view the full contents of a public channel via a direct URL without being prompted to log in, so that I can get the answer to my specific question immediately without the friction of creating an account I might only use once.

> **Unified Backend Reference:** This feature's backend classes are part of the shared Harmony backend defined in [`unified-backend-architecture.md`](./unified-backend-architecture.md). The mapping from this spec's class labels to the unified module labels is in §10 of that document. Key modules contributed by this feature: **M-B2** (Access Control), **M-B4** (Content Delivery), **M-D1** (Data Access, shared).

---

## 1. Header

### Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Cross-spec consolidation: label fixes, cache key alignment, convention standardization |

### Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0, 2.0 |
| dblanc        | Project Lead            | 1.0     |
| Aiden-Barrera | Project Member          | 2.0     |

---

## 2. Architecture Diagram

### 2.1 System Overview

```mermaid
graph TB
    subgraph Actors["External Actors"]
        GuestUser["A1: Guest User\nAnonymous browser user"]
        BotUser["A2: Search Engine Bot\nGooglebot, Bingbot, etc."]
    end

    subgraph EdgeLayer["Edge Layer (CDN - CloudFlare)"]
        CacheRouter["W1.1 CacheRouter\ncheckCache()\nserveFromCache()\ncacheResponse()"]
        BotDetector["W1.2 BotDetector\ndetectBot()\napplyBotHeaders()\nrateLimitBot()"]
    end

    subgraph MGV1["M-GV1: Public View Module (Next.js SSR)"]
        PublicChannelPage["PublicChannelPage\ngetServerSideProps()\nrender()"]
        SEOMetadata["SEOMetadataComponent\ngenerateMetaTags()\ngenerateStructuredData()"]
        MessageListComp["MessageListComponent\nrender()\nloadMoreMessages()"]
        GuestPromoBanner["GuestPromoBanner\nrender()\nonJoinClick()"]
        MessageCard["MessageCard\nrender()\nformatTimestamp()"]
        ServerSidebar["ServerSidebar\nrender()\nnavigateToChannel()"]
    end

    subgraph MGV2["M-GV2: Client Interaction Module (Browser)"]
        InfiniteScrollHandler["InfiniteScrollHandler\nobserve()\nonIntersect()\nloadMore()"]
        MessageLinkHandler["MessageLinkHandler\nscrollToMessage()\nhighlightMessage()"]
        SearchHighlighter["SearchHighlighter\nparseSearchTerms()\nhighlightMatches()"]
        ShareHandler["ShareHandler\nshareToTwitter()\ncopyLink()"]
    end

    subgraph MB1["M-B1: API Gateway (Public API)"]
        PublicChannelCtrl["PublicChannelController\n(REST, public)\ngetPublicChannelPage()\ngetPublicMessages()"]
        PublicServerCtrl["PublicServerController\n(REST, public)\ngetPublicServerInfo()\ngetPublicChannelList()"]
    end

    subgraph MB2["M-B2: Access Control"]
        VisibilityGuard["VisibilityGuard\nisChannelPublic()\ngetVisibilityStatus()"]
        ContentFilter["ContentFilter\nfilterSensitiveContent()\nredactUserMentions()"]
        RateLimiter["RateLimiter\ncheckLimit()\nincrementCounter()"]
        AnonSessionMgr["AnonymousSessionManager\ngetOrCreateSession()\nstorePreference()"]
    end

    subgraph MB4["M-B4: Content Delivery"]
        MessageService["MessageService\ngetMessagesForPublicView()\ngetMessageById()"]
        AuthorService["AuthorService\ngetPublicAuthorInfo()\nanonymizeAuthor()"]
        AttachmentService["AttachmentService\ngetPublicAttachmentUrl()\nisAttachmentPublic()"]
        SEOService["SEOService\ngeneratePageTitle()\ngenerateDescription()\ngenerateStructuredData()"]
    end

    subgraph MD1["M-D1: Data Access"]
        ChannelRepo["ChannelRepository\nfindBySlug()\nfindPublicByServerId()\ngetVisibility()"]
        MessageRepo["MessageRepository\nfindByChannelPaginated()\nfindById()"]
        ServerRepo["ServerRepository\nfindBySlug()\ngetPublicInfo()"]
        UserRepo["UserRepository\nfindById()\ngetPublicProfile()"]
    end

    subgraph MD2["M-D2: Persistence (PostgreSQL)"]
        ServersTable[("servers")]
        ChannelsTable[("channels")]
        MessagesTable[("messages")]
        UsersTable[("users")]
        AttachmentsTable[("attachments")]
    end

    subgraph MD3["M-D3: Cache (Redis)"]
        VisCache["channel:{channelId}:visibility\nTTL: 3600s (M-B3 owner)"]
        MsgsCache["channel:msgs:{channelId}:page:{pageNum}\nTTL: 60s (M-B4 owner)"]
        ServerCache["server:{serverId}:info\nTTL: 300s (M-B4 owner)"]
        GuestSession["guest:session:{sessionId}\nTTL: 86400s (M-B2 owner)"]
    end

    GuestUser -->|HTTPS GET| CacheRouter
    BotUser -->|HTTPS GET| CacheRouter
    CacheRouter --> BotDetector
    CacheRouter -->|Cache Miss| PublicChannelPage
    PublicChannelPage --> SEOMetadata
    PublicChannelPage --> MessageListComp
    PublicChannelPage --> GuestPromoBanner
    PublicChannelPage --> ServerSidebar
    MessageListComp --> MessageCard
    InfiniteScrollHandler -->|REST| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicServerCtrl
    PublicChannelCtrl --> VisibilityGuard
    PublicChannelCtrl --> RateLimiter
    PublicChannelCtrl --> AnonSessionMgr
    PublicChannelCtrl --> MessageService
    PublicChannelCtrl --> SEOService
    MessageService --> ContentFilter
    MessageService --> AttachmentService
    MessageService --> AuthorService
    VisibilityGuard --> ChannelRepo
    MessageService --> MessageRepo
    AuthorService --> UserRepo
    PublicServerCtrl --> ServerRepo
    ChannelRepo --> ChannelsTable
    ChannelRepo --> VisCache
    MessageRepo --> MessagesTable
    MessageRepo --> MsgsCache
    ServerRepo --> ServersTable
    ServerRepo --> ServerCache
    UserRepo --> UsersTable
    AttachmentService --> AttachmentsTable
    AnonSessionMgr --> GuestSession
```

> **Note:** All cache keys use UUID-based identifiers (e.g., `channel:{channelId}:visibility`) for consistency across all Harmony specs.

### 2.2 Information Flow Summary

| Flow ID | Source | Destination | Data | Protocol |
|---------|--------|-------------|------|----------|
| F1 | A1 Guest User | W1.1 CacheRouter | HTTP GET Request | HTTPS |
| F2 | W1.1 CacheRouter | C1.1 PublicChannelPage | Cache Miss Forward | HTTPS |
| F3 | C1.1 PublicChannelPage | C3.1 PublicChannelController | Channel Data Request | Internal |
| F4 | C3.1 PublicChannelController | C4.1 VisibilityGuard | Visibility Check | Internal |
| F5 | C4.1 VisibilityGuard | C6.1 ChannelRepository | Database Query | Internal |
| F6 | C3.1 PublicChannelController | C5.1 MessageService | Message Fetch | Internal |
| F7 | C5.1 MessageService | C6.2 MessageRepository | Paginated Query | Internal |
| F8 | C5.4 SEOService | C1.2 SEOMetadataComponent | SEO Data | Internal |
| F9 | C1.1 PublicChannelPage | W1.1 CacheRouter | Rendered HTML | HTTPS |
| F10 | W1.1 CacheRouter | A1 Guest User | Cached/Fresh Response | HTTPS |

### 2.3 Request Path Diagram

```mermaid
sequenceDiagram
    participant Guest as Guest User
    participant CDN as CDN Edge
    participant NextJS_SSR as Next.js SSR
    participant Database as Database

    Guest->>CDN: GET /c/gamedev/help
    CDN-->>CDN: Cache MISS
    CDN->>NextJS_SSR: Forward to origin
    NextJS_SSR->>Database: Check visibility
    Database-->>NextJS_SSR: visibility=PUBLIC
    NextJS_SSR->>Database: Fetch messages
    Database-->>NextJS_SSR: Message[]
    NextJS_SSR-->>NextJS_SSR: Render HTML with SEO tags
    NextJS_SSR-->>CDN: HTML + Cache-Control
    CDN-->>CDN: Store in cache
    CDN-->>Guest: HTML Response
    Guest-->>Guest: Browser renders page immediately
```

### 2.4 Rationale

The archtecture diagram is justified because client server split abstracts from the guest the authorization logic the server handles and caching requests significantly helps with performance for storing the same content that will be served to many users. Furthermore, the importance of authorization lies in the fact whether a channel is public or not, to make sure guests can't see private channels. 

---

## 3. Class Diagram

```mermaid
classDiagram
    class IPublicContentProvider {
        <<interface>>
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicChannelProvider {
        -channelRepo
        -visibilityGuard
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicMessageProvider {
        -messageRepo
        -contentFilter
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicServerProvider {
        -serverRepo
        -channelRepo
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class VisibilityGuard {
        -channelRepo
        -cache
        +isChannelPublic()
        +isServerPublic()
        +getVisibilityStatus()
    }

    class ContentFilter {
        -patterns
        +filterSensitiveContent()
        +redactUserMentions()
        +sanitizeForDisplay()
        +sanitizeAttachments()
    }

    class PublicChannelPage {
        <<React Component>>
        +serverSlug string
        +channelSlug string
        +initialData PageData
        +getServerSideProps()
        +render()
    }

    class SEOMetadataComponent {
        +title string
        +description string
        +canonicalUrl string
        +generateMetaTags()
        +generateStructuredData()
    }

    class MessageListComponent {
        +messages Message[]
        +hasMore boolean
        +render()
        +loadMoreMessages()
        +scrollToMessage()
    }

    class GuestPromoBanner {
        +serverName string
        +channelName string
        +memberCount number
        +render()
        +onJoinClick()
        +onDismiss()
    }

    class MessageCard {
        +message Message
        +author AuthorDTO
        +render()
        +formatTimestamp()
        +renderAttachments()
    }

    class ServerSidebar {
        +serverInfo ServerDTO
        +publicChannels ChannelDTO[]
        +render()
        +navigateToChannel()
    }

    class Channel {
        <<Entity>>
        +id UUID
        +serverId UUID
        +name string
        +slug string
        +visibility Enum
        +topic string
    }

    class Message {
        <<Entity>>
        +id UUID
        +channelId UUID
        +authorId UUID
        +content string
        +createdAt DateTime
        +editedAt DateTime
        +isDeleted boolean
    }

    class Server {
        <<Entity>>
        +id UUID
        +name string
        +slug string
        +description string
        +isPublic boolean
        +memberCount number
    }

    class User {
        <<Entity>>
        +id UUID
        +username string
        +displayName string
        +avatarUrl string
        +publicProfile boolean
    }

    class Attachment {
        <<Entity>>
        +id UUID
        +messageId UUID
        +filename string
        +url string
        +contentType string
        +sizeBytes number
    }

    class ChannelRepository {
        +findBySlug()
        +findPublicByServerId()
        +getVisibility()
    }

    class MessageRepository {
        +findByChannelPaginated()
        +findById()
        +countByChannel()
    }

    class ServerRepository {
        +findBySlug()
        +getPublicInfo()
    }

    class UserRepository {
        +findById()
        +getPublicProfile()
    }

    IPublicContentProvider <|.. PublicChannelProvider
    IPublicContentProvider <|.. PublicMessageProvider
    IPublicContentProvider <|.. PublicServerProvider
    PublicChannelProvider o-- VisibilityGuard
    PublicMessageProvider o-- ContentFilter
    PublicChannelPage *-- SEOMetadataComponent
    PublicChannelPage *-- MessageListComponent
    PublicChannelPage *-- GuestPromoBanner
    PublicChannelPage *-- ServerSidebar
    MessageListComponent *-- MessageCard
    VisibilityGuard ..> ChannelRepository
    Channel "1" o-- "many" Message
    Server "1" o-- "many" Channel
    Message o-- Attachment
    ChannelRepository ..> Channel
    MessageRepository ..> Message
    ServerRepository ..> Server
    UserRepository ..> User
```

### 3.1 Rationale

The class diagram clearly separates the entities that will be needed for displaying the public channel to the guest user, specifically with only grabbing public entities such as the server, messages and owner of the message to avoid exposing private channel information. 

---

## 4. List of Classes

### 4.1 Edge Layer (W1)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-W1.1 | CacheRouter | Edge Worker | Routes requests through CDN cache, determines cache hit/miss, manages cache keys |
| CL-W1.2 | BotDetector | Edge Worker | Identifies search engine bots vs human users, applies appropriate rate limits and headers |

### 4.2 Public View Module (M1)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C1.1 | PublicChannelPage | Page Component | Main Next.js page component for rendering public channel content with SSR |
| CL-C1.2 | SEOMetadataComponent | UI Component | Generates and renders SEO meta tags, Open Graph tags, and structured data |
| CL-C1.3 | MessageListComponent | UI Component | Renders paginated list of messages with infinite scroll support |
| CL-C1.4 | GuestPromoBanner | UI Component | Non-intrusive banner encouraging guests to join the community |
| CL-C1.5 | MessageCard | UI Component | Renders individual message with author info, timestamp, and attachments |
| CL-C1.6 | ServerSidebar | UI Component | Displays server info and list of other public channels for navigation |

### 4.3 Client Interaction Module (M2)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C2.1 | InfiniteScrollHandler | Client Component | Manages intersection observer for loading more messages on scroll |
| CL-C2.2 | MessageLinkHandler | Client Component | Handles deep links to specific messages, scrolls and highlights target |
| CL-C2.3 | SearchHighlighter | Client Component | Highlights search terms from referrer URL in message content |
| CL-C2.4 | ShareHandler | Client Component | Provides sharing functionality for messages and channel links |

### 4.4 Public API Module (M3)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C3.1 | PublicChannelController | Controller | Handles API requests for public channel data without authentication |
| CL-C3.2 | PublicServerController | Controller | Handles API requests for public server information |

### 4.5 Access Control Module (M4)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C4.1 | VisibilityGuard | Service | Checks channel/server visibility before serving content to guests |
| CL-C4.2 | ContentFilter | Service | Filters sensitive content, redacts private mentions from public view |
| CL-C4.3 | RateLimiter | Middleware | Prevents abuse by limiting request rate for anonymous users |
| CL-C4.4 | AnonymousSessionManager | Service | Manages lightweight sessions for guests to store preferences |

### 4.6 Content Delivery Module (M5)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C5.1 | MessageService | Service | Retrieves and formats messages for public display |
| CL-C5.2 | AuthorService | Service | Provides public author information, respects privacy settings |
| CL-C5.3 | AttachmentService | Service | Manages public access to message attachments |
| CL-C5.4 | SEOService | Service | Generates SEO metadata, structured data, and canonical URLs |

### 4.7 Data Access Module (M6)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C6.1 | ChannelRepository | Repository | Data access for channel entities with visibility filtering |
| CL-C6.2 | MessageRepository | Repository | Data access for messages with pagination support |
| CL-C6.3 | ServerRepository | Repository | Data access for server entities |
| CL-C6.4 | UserRepository | Repository | Data access for user public profile data |

### 4.8 Data Transfer Objects

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-D1 | PublicChannelDTO | DTO | Public-safe channel data for API responses |
| CL-D2 | PublicMessageDTO | DTO | Public-safe message data with permalink |
| CL-D3 | PublicAuthorDTO | DTO | Public author info without user ID |
| CL-D4 | PublicServerDTO | DTO | Public server info for display |
| CL-D5 | PageDataDTO | DTO | Combined data for SSR page rendering |
| CL-D6 | SEODataDTO | DTO | SEO metadata for page head |

#### PublicChannelDTO Fields

```typescript
interface PublicChannelDTO {
  id: string;           // Channel UUID
  name: string;         // Display name
  slug: string;         // URL-safe identifier
  topic: string;        // Channel topic/description
  messageCount: number; // Total messages in channel (computed, not a DB column)
  serverSlug: string;   // Parent server's slug
}
```

#### ChannelVisibility Enum

```typescript
enum ChannelVisibility {
  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',   // Visible to guests and indexed by search engines
  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',     // Visible to guests but not indexed
  PRIVATE = 'PRIVATE'                      // Only visible to authenticated members
}
```

### 4.9 Domain Entities

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-D7 | Channel | Entity | Channel domain entity with visibility state |
| CL-D8 | Message | Entity | Message domain entity |
| CL-D9 | Server | Entity | Server domain entity |
| CL-D10 | User | Entity | User domain entity with privacy settings |
| CL-D11 | Attachment | Entity | Message attachment entity |

### 4.10 Rationale

The list of classes clearly states the moving parts for ensuring guest user can access public channels and their messages, with handling caching. The classes cover all the responsibilities needed for this feature to function from route handling to retrieving the public data to formatting the response to the guest. The inclusion of caching and bot detection justified since retrieval of the same content from multiple guest is unnecessary more work on the server. 

---

## 5. State Diagrams

### 5.1 System State Variables

| Variable | Type | Description |
|----------|------|-------------|
| request.path | string | Current URL path being requested |
| channel.visibility | ChannelVisibility | Visibility state of requested channel |
| cache.status | CacheStatus | Whether response is cached (HIT/MISS/STALE) |
| guest.sessionId | string | Anonymous session identifier |
| page.loadState | LoadState | Current page loading state |
| messages.pagination | PaginationState | Current pagination position |

> **Convention:** `is_public` (boolean) applies to **servers** — whether the server appears in discovery. `visibility` (enum: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`) applies to **channels** — whether channel content is accessible to guests and/or indexed by search engines.

### 5.2 Page Load State Machine

```mermaid
stateDiagram-v2
    [*] --> S1 : GET /c/{server}/{channel}

    S1 : S1: Edge Cache Check\ncache.status=CHECKING
    S2 : S2: Serve Cached\ncache.status=HIT\nresponse.source=EDGE
    S3 : S3: Origin Request\ncache.status=MISS\nrequest.forwarded=true
    S4 : S4: Visibility Check\nchannel.visibility=?
    S5 : S5: Access Denied\nerror=403 OR redirect=true
    S6 : S6: Fetch Content\nmessages=loading\nserver=loading
    S7 : S7: Render Page\npage.loadState=COMPLETE\nseo.tags=generated
    S8 : S8: Cache Response\ncache.stored=true\ncache.ttl=60s
    S9 : S9: Response Delivered\npage.loadState=DELIVERED

    S1 --> S2 : Cache hit (valid or stale <300s)\n[return cached HTML; stale triggers background revalidation]
    S1 --> S3 : Cache miss or expired\n[forward to origin]
    S3 --> S4 : Always\n[query database]
    S4 --> S5 : visibility != PUBLIC_*\n[return 403 or redirect]
    S4 --> S6 : visibility = PUBLIC_*\n[query messages]
    S6 --> S7 : Content retrieved\n[generate HTML]
    S7 --> S8 : Rendering complete\n[store in edge cache]
    S2 --> S9 : Response ready\n[send to client]
    S8 --> S9 : Response ready\n[send to client]
    S5 --> S9 : Response ready\n[send to client]
```

### 5.3 Message Loading State Machine (Client-Side Hydration)

```mermaid
stateDiagram-v2
    [*] --> M1 : Page hydrated\n(initial messages rendered)

    M1 : M1: Initial View\nmessages.count=initialBatch\npagination.hasMore=true\nscroll.position=top
    M2 : M2: Loading More\nloading=true\npagination.page++
    M3 : M3: Scrolling to Message\ntargetMessage=id\nscroll.behavior=smooth
    M4 : M4: Messages Appended\nmessages+=newBatch\nloading=false
    M5 : M5: Message Highlighted\nhighlight.visible=true\nhighlight.ttl=3s

    M1 --> M2 : Scroll to bottom
    M1 --> M3 : Click message link
    M2 --> M4 : API returns
    M3 --> M5 : Message found
    M4 --> M1 : Return to browsing state
    M5 --> M1 : Return to browsing state
```

### 5.4 Access Denial State Machine

```mermaid
stateDiagram-v2
    [*] --> D1 : Private channel requested\n(visibility=PRIVATE)

    D1 : D1: Evaluate Response\nserver.isPublic=?\nreferrer.source=?
    D2 : D2: Show Login Prompt\n"Log in to view this channel"\n+ explain why + link to join
    D3 : D3: Show Server Landing\nRedirect to /s/{server}\nShow public channels list
    D4 : D4: Show 404 Not Found\nChannel does not exist or is private\n(no info leak)

    D1 --> D2 : From search engine\n[403 + Login prompt]
    D1 --> D3 : Server is public\n[Redirect to server landing]
    D1 --> D4 : Server is private OR channel not found\n[404 Not Found]
```

### 5.5 Rationale

These states were chosen to show the phases a guest can be for viewing a public channel, the states handle critical edge cases a guest can experience since the endpoints are publicily accessible such as trying to visit a private channel or channel that isn't cached. The state also has no login redirect due to the fact that this feature is supposed allow anonymous users to access public channels. Importantly each state has a clear end to each phase so the guest ins't stuck in a loop state that they can't get out off.

---

## 6. Flow Charts

### 6.1 Scenario: Guest Views Public Channel from Search Result

**Scenario Description:** A guest user clicks a search result link that leads to a public channel. The system serves the full content without any login prompts, allowing the user to immediately access the information they were searching for.

```mermaid
flowchart TD
    Start(["START: Guest clicks search result\nURL: /c/gamedev/help-and-questions?m=abc123\nReferrer: google.com search"])
    F11["F1.1 Request reaches CloudFlare edge\nCacheRouter.checkCache()"]
    CacheHit{"F1.2: Cache hit?"}
    F13["F1.3 Serve cached HTML response"]
    F14["F1.4 Forward to origin server"]
    F15["F1.5 Parse URL params\nserverSlug, channelSlug, messageId"]
    F16["F1.6 Look up channel\nChannelRepository.findBySlug(serverSlug, channelSlug)"]
    ChExists{"F1.7: Channel exists?"}
    F18["F1.8 Return 404\nChannel not found"]
    F19["F1.9 Check visibility\nVisibilityGuard.isChannelPublic(channelId)"]
    IsPublic{"F1.10: Is PUBLIC_INDEXABLE\nor PUBLIC_NO_INDEX?"}
    F111["F1.11 Handle private channel\n(See Flow 6.2)"]
    F112["F1.12 Fetch server info\nServerRepository.getPublicInfo(serverId)"]
    F113["F1.13 Fetch public channels for sidebar\nChannelRepository.findPublicByServerId()"]
    F114["F1.14 Fetch messages\nMessageService.getMessagesForPublicView(channelId, page=1, limit=50)"]
    F115["F1.15 Filter content\nContentFilter.filterSensitiveContent()\nContentFilter.redactUserMentions()"]
    F115b["F1.15b Resolve attachments\nAttachmentService.getPublicAttachmentUrl()\nAttachmentService.isAttachmentPublic()"]
    F116["F1.16 Build public author DTOs\nAuthorService.getPublicAuthorInfo()"]
    F117["F1.17 Generate SEO data\nSEOService.generatePageTitle()\ngenerateDescription()\ngenerateStructuredData()"]
    F118["F1.18 Render HTML with Next.js SSR\n- SEO meta tags\n- Server sidebar\n- Message list\n- Guest promo banner\n- Structured data JSON-LD"]
    F119["F1.19 Set cache headers\nCache-Control: public, max-age=60, s-maxage=60\nstale-while-revalidate=300\nX-Robots-Tag: index, follow"]
    F120["F1.20 Response delivered to guest browser"]
    F121["F1.21 Browser renders page\nGuest sees full channel content"]
    MsgInUrl{"F1.22: messageId in URL?"}
    F123["F1.23 Display from top of channel"]
    F124["F1.24 Scroll to message and highlight it\nMessageLinkHandler.scrollToMessage()\nMessageLinkHandler.highlightMessage()"]
    F125["F1.25 Parse search terms from referrer URL\nSearchHighlighter.parseSearchTerms()\nSearchHighlighter.highlightMatches()"]
    End(["END: Guest viewing public channel\n- Full content visible\n- No login prompt shown\n- Search terms highlighted\n- Can navigate to other public channels"])

    Start --> F11 --> CacheHit
    CacheHit -->|Yes| F13 --> F120
    CacheHit -->|No| F14 --> F15 --> F16 --> ChExists
    ChExists -->|No| F18 --> F120
    ChExists -->|Yes| F19 --> IsPublic
    IsPublic -->|No PRIVATE| F111 --> F120
    IsPublic -->|Yes| F112 --> F113 --> F114 --> F115 --> F115b --> F116 --> F117 --> F118 --> F119 --> F120
    F120 --> F121 --> MsgInUrl
    MsgInUrl -->|No| F123 --> F125
    MsgInUrl -->|Yes| F124 --> F125
    F125 --> End
```

### 6.2 Scenario: Guest Requests Private Channel

**Scenario Description:** A guest user requests a channel URL that points to a private channel. The system provides a helpful response without revealing sensitive information about the server's structure.

```mermaid
flowchart TD
    Start(["START: Guest requests private channel\nURL: /c/company/internal-hr"])
    F21["F2.1 Visibility check returns PRIVATE\nVisibilityGuard.getVisibilityStatus()"]
    F22["F2.2 Check request context\n- Parse referrer header\n- Check if from search engine\n- Check server publicity"]
    ServerPublic{"F2.3: Server is public?"}
    F24["F2.4 Return 404\nPage not found\n(do not reveal that server or channel exists)"]
    F25["F2.5 Check referrer"]
    FromSearch{"F2.6: From search engine?"}
    F27["F2.7 Show login prompt\nThis channel requires membership to view.\nLogin / Create Account / Browse Public Channels"]
    F28["F2.8 Redirect to server landing page\n302 Redirect to /s/company\nShow list of public channels"]
    End(["END: Appropriate response served\n- No sensitive info leaked\n- User guided to available content\n- Clear explanation provided"])

    Start --> F21 --> F22 --> ServerPublic
    ServerPublic -->|No| F24 --> End
    ServerPublic -->|Yes| F25 --> FromSearch
    FromSearch -->|Yes| F27 --> End
    FromSearch -->|No| F28 --> End
```

### 6.3 Scenario: Guest Loads More Messages (Infinite Scroll)

**Scenario Description:** A guest user scrolls to the bottom of the message list, triggering the infinite scroll mechanism to load older messages without a full page reload.

```mermaid
flowchart TD
    Start(["START: Guest scrolls to bottom"])
    F31["F3.1 IntersectionObserver detects sentinel element\nInfiniteScrollHandler.onIntersect()"]
    HasMore{"F3.2: hasMore == true?"}
    F33["F3.3 Do nothing\nAll messages loaded"]
    F34["F3.4 Set loading state\nloading=true\nShow loading spinner"]
    F35["F3.5 Fetch next page\nGET /api/public/channels/{channelId}/messages\n?page={currentPage+1}&limit=50"]
    F36["F3.6 Server validates channel is still public\n(visibility could change)"]
    StillPublic{"F3.7: Still public?"}
    F38["F3.8 Return 403\nShow channel is now private message"]
    F39["F3.9 Fetch messages\nMessageRepository.findByChannelPaginated()"]
    F310["F3.10 Apply content filter\nContentFilter.filterSensitiveContent()"]
    F311["F3.11 Return JSON response\n{messages: MessageDTO[], hasMore: boolean, nextPage: number}"]
    F312["F3.12 Append messages to existing list\nMessageListComponent.appendMessages()"]
    F313["F3.13 Update state\nloading=false\nhasMore=response.hasMore\ncurrentPage++"]
    End(["END: More messages displayed\n- Seamless scroll experience\n- No page reload required\n- Loading indicator shown during fetch"])

    Start --> F31 --> HasMore
    HasMore -->|No| F33
    HasMore -->|Yes| F34 --> F35 --> F36 --> StillPublic
    StillPublic -->|No| F38
    StillPublic -->|Yes| F39 --> F310 --> F311 --> F312 --> F313 --> End
```

### 6.4 Scenario: Search Engine Bot Crawls Public Channel

**Scenario Description:** A search engine bot (Googlebot, Bingbot, etc.) crawls a public channel page. The system serves optimized content with appropriate SEO signals.

```mermaid
flowchart TD
    Start(["START: Bot requests public channel\nUser-Agent: Googlebot/2.1\nURL: /c/opensource/announcements"])
    F41["F4.1 Bot detection at edge\nBotDetector.detectBot()\nIdentified: Googlebot"]
    F42["F4.2 Apply bot-specific handling\n- Skip JS-dependent content\n- Ensure full HTML render\n- Apply bot rate limits"]
    F43SameFlow["Same visibility and content flow as F1.4-F1.18"]
    F43["F4.3 Generate bot-optimized response\n- Full message content inline\n- Structured data JSON-LD\n- Canonical URL\n- Breadcrumb schema\n- hreflang tags if i18n"]
    F44["F4.4 Set SEO headers\nX-Robots-Tag: index, follow\nLink: canonical; rel=canon\nCache-Control: public, s-maxage=3600"]
    F45["F4.5 Return HTML with structured data\nscript type=application/ld+json\n{ @context: schema.org, @type: DiscussionForumPosting, ... }"]
    End(["END: Bot crawl complete\n- Content indexed\n- Structured data parsed\n- Links discovered"])

    Start --> F41 --> F42 --> F43SameFlow --> F43 --> F44 --> F45 --> End
```

### 6.5 Cross-Spec Integration: VISIBILITY_CHANGED Event Consumption

When the Channel Visibility Toggle spec emits a `VISIBILITY_CHANGED` event (via Redis Pub/Sub EventBus), the Guest Public Channel View system reacts as follows:

| New Visibility | Guest View Action |
|---------------|-------------------|
| `PUBLIC_INDEXABLE` | Warm guest view cache for channel; begin serving public content |
| `PUBLIC_NO_INDEX` | Keep guest view cache (content still public); update `X-Robots-Tag` to `noindex` |
| `PRIVATE` | Invalidate all guest view caches for channel; return 403/404 on subsequent requests |

**Event Payload Consumed:**
```typescript
interface VisibilityChangeEvent {
  channelId: string;        // UUID
  oldVisibility: ChannelVisibility;
  newVisibility: ChannelVisibility;
  actorId: string;          // UUID of admin who made the change
  timestamp: DateTime;
}
```

**Cache Keys Invalidated on PRIVATE:**
- `channel:{channelId}:visibility`
- `channel:{channelId}:msgs:*` (all pages)
- `server:{serverId}:info`

### 6.6 Rationale 

The flow charts depict the major flow cases a guest will experience for Harmony. The first flow covers the primary case that the guest visits the public channel from search engine result, which is the primary aim for Harmony, to be able to provide public channel information to guests without the need of logging in. The second flow covers the edge case a guests tries to visit a private channel, safely redirecting them without revealing any sensitive information about the server. The third flow covers the guest loading more messages of the channel, allowing the guest to infinitely scroll older messages. The fourth flow covers the public channels to be crawlable by search engine bots, so guests searching for information related to public channels can see it. 

---

## 7. Development Risks and Failures

### 7.1 Runtime Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| RF-1 | SSR render crash | 500 error page | React hydration failure | Error boundary catches; shows fallback UI | Medium | High |
| RF-2 | Database query timeout | Slow page load or timeout | Connection pool exhaustion | Query optimization; read replicas; timeout handling | Medium | Medium |
| RF-3 | Cache corruption | Stale or incorrect content shown | Cache-DB inconsistency | Cache invalidation; serve from DB | Low | Medium |
| RF-4 | Memory leak in SSR | Gradual performance degradation | Node.js process OOM | Process recycling; memory monitoring | Low | High |
| RF-5 | Infinite scroll breaks | Users can't load more messages | Client JS error | Fallback pagination links; error logging | Medium | Low |
| RF-6 | SEO data generation fails | Missing meta tags | Empty title/description | Default fallback values; monitoring | Low | Medium |
| RF-7 | Content filter regex timeout | Slow response on large messages | CPU spike | Regex timeout limits; message size limits | Low | Medium |

### 7.2 Connectivity Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| CF-1 | CDN edge outage | Regional unavailability | Cache layer bypassed | Multi-CDN failover; origin direct access | Low | High |
| CF-2 | Origin unreachable | 502/503 errors | CDN can't reach server | Health checks; auto-scaling; stale-while-revalidate | Low | High |
| CF-3 | Database connection loss | 500 errors | All queries fail | Connection retry; replica failover | Low | Critical |
| CF-4 | Redis cache unavailable | Slower responses | Cache misses; DB load increase | Degrade gracefully; serve from DB | Medium | Medium |
| CF-5 | Slow network to guest | Long load times | Time to first byte high | CDN edge caching; image optimization | Medium | Medium |

### 7.3 Hardware Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| HF-1 | Web server crash | Brief unavailability | Container restart | Auto-restart; load balancer rerouting | Low | Medium |
| HF-2 | Database server down | Complete outage | All writes/reads fail | Automatic failover to replica | Very Low | Critical |
| HF-3 | Storage full | New messages not visible | Write failures | Storage alerts; auto-scaling storage | Low | High |

### 7.4 Security/Intruder Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| IF-1 | DDoS on public pages | Service degradation | Resource exhaustion | CloudFlare DDoS protection; rate limiting | Medium | High |
| IF-2 | Scraping abuse | None (internal cost) | Bandwidth/compute abuse | Bot detection; rate limiting; CAPTCHA | High | Medium |
| IF-3 | Visibility bypass attempt | 403 error (if working) | Security log entry | Input validation; server-side checks | Medium | Critical |
| IF-4 | XSS via message content | Malicious script execution | User session compromise | Content sanitization; CSP headers | Low | Critical |
| IF-5 | Cache poisoning | Wrong content served | Cache serves malicious response | Cache key validation; purge capability | Very Low | Critical |
| IF-6 | Enumeration attack | None (if protected) | Load on database | Rate limiting; no existence disclosure | Medium | Low |

### 7.5 Content/Data Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| DF-1 | Private content exposed | Privacy breach | Visibility check bypassed | Audit; immediate visibility fix; notification | Very Low | Critical |
| DF-2 | User ID leaked in public DTO | Privacy concern | PII exposure | DTO review; immediate patch | Low | High |
| DF-3 | Deleted message shown | Confusing content | Soft delete not respected | Query filter fix; cache purge | Low | Medium |
| DF-4 | Attachment not loading | Broken images/files | Storage access issue | CDN retry; fallback placeholder | Medium | Low |

### 7.6 Failure Priority Matrix

```mermaid
graph LR
    subgraph Matrix["Failure Priority Matrix (Likelihood × Impact)"]
        subgraph High["High Likelihood"]
            H_Low["Low Impact:\nIF-2"]
            H_High["High Impact:\nIF-1"]
        end
        subgraph Medium["Medium Likelihood"]
            M_Low["Low Impact:\nRF-5, IF-6"]
            M_Med["Medium Impact:\nRF-2, CF-4, CF-5"]
            M_High["High Impact:\nRF-1"]
            M_Crit["Critical Impact:\nIF-3"]
        end
        subgraph Low["Low Likelihood"]
            L_Med["Medium Impact:\nRF-3, RF-6\nRF-7, DF-3"]
            L_High["High Impact:\nRF-4, HF-1\nDF-2, HF-3"]
            L_Crit["Critical Impact:\nCF-3, IF-4, DF-1"]
            L_LowImpact["Low Impact:\nDF-4"]
        end
        subgraph VeryLow["Very Low Likelihood"]
            VL_High["High Impact:\nCF-1, CF-2"]
            VL_Crit["Critical Impact:\nHF-2, IF-5"]
        end
    end
```

### 7.7 Rationale 

The development risks and failures categories were chosen to represent the primary threat this feature can face. The runtime and connectivity failures are catagorized due to the feature being a publicly accessible endpoint that any guest can use, leading to unpredictable traffic volumes. Intruder risks face the highest priorty due to the endpoint having no authentication since guests aren't required to log in. 

---

## 8. Technology Stack

| Label | Technology | Version | Purpose | Rationale | Source/Documentation |
|-------|------------|---------|---------|-----------|---------------------|
| T1 | TypeScript | 5.3+ | Primary language | Type safety across stack | https://www.typescriptlang.org/ |
| T2 | React | 18.2+ | UI framework | Component model; hydration support | https://react.dev/ |
| T3 | Next.js | 14.0+ | React framework with SSR | Critical for SEO; server components | https://nextjs.org/ |
| T4 | Node.js | 20 LTS | Server runtime | SSR execution; API routes | https://nodejs.org/ |
| T5 | PostgreSQL | 16+ | Primary database | Robust queries; full-text search | https://www.postgresql.org/ |
| T6 | Redis | 7.2+ | Caching and EventBus (Pub/Sub) | Fast reads; session storage; event messaging | https://redis.io/ |
| T7 | Prisma | 5.8+ | ORM | Type-safe database access | https://www.prisma.io/ |
| T8 | tRPC | 10.45+ | End-to-end typesafe APIs (authenticated internal) | Type-safe client-server communication | https://trpc.io/ |
| T9 | Zod | 3.22+ | Validation | Runtime type checking (integrates with tRPC) | https://zod.dev/ |
| T10 | TailwindCSS | 3.4+ | Styling | Utility-first; consistent design | https://tailwindcss.com/ |
| T11 | CloudFlare | N/A | CDN/Edge | Global caching; DDoS protection; edge workers | https://www.cloudflare.com/ |
| T12 | Docker | 24+ | Containerization | Consistent environments | https://www.docker.com/ |
| T13 | Google Search Console API | v1 | Programmatic indexing | Sitemap ping; URL submission | https://developers.google.com/webmaster-tools |
| T14 | Bing Webmaster API | v1 | Microsoft search integration | URL submission; sitemap ping | https://www.bing.com/webmasters |
| T15 | Jest | 29+ | Unit testing | Component and service tests | https://jestjs.io/ |
| T16 | Playwright | 1.40+ | E2E testing | SEO verification; crawl simulation | https://playwright.dev/ |
| T17 | sanitize-html | 2.12+ | HTML sanitization | XSS prevention (Node.js-native) | https://github.com/apostrophecms/sanitize-html |
| T18 | schema-dts | 1.1+ | Structured data types | Type-safe JSON-LD generation | https://github.com/google/schema-dts |
| T19 | intersection-observer | (polyfill) | Infinite scroll | Cross-browser scroll detection | https://github.com/w3c/IntersectionObserver |
| T20 | sharp | 0.33+ | Image processing | Thumbnail generation; optimization | https://sharp.pixelplumbing.com/ |
| T21 | Lighthouse CI | 11+ | Performance testing | Core Web Vitals monitoring | https://github.com/GoogleChrome/lighthouse-ci |

> **Convention:** tRPC is used for authenticated internal APIs between client and server. Public-facing endpoints (public channel pages, sitemaps, robots.txt) use REST for maximum compatibility with crawlers and third-party consumers.

### 8.1 EventBus

**Technology:** Redis Pub/Sub (T6)

Event types consumed by this spec:

| Event | Source Spec | Description |
|-------|-------------|-------------|
| `VISIBILITY_CHANGED` | Channel Visibility Toggle | Channel visibility state changed; invalidate/warm caches |
| `MESSAGE_CREATED` | SEO Meta Tag Generation | New message in public channel; invalidate message cache |
| `MESSAGE_EDITED` | SEO Meta Tag Generation | Message edited; invalidate affected cache pages |
| `MESSAGE_DELETED` | SEO Meta Tag Generation | Message deleted; invalidate affected cache pages |

### 8.2 Rationale

The technology stack was chosen to align with Harmony's architecture design and meet the needs of this feature. The primary langauge to be used for Harmony is Typescript, the reason is ensuring type safety accross the website, reducing runtime errors. Redis will serve our caching layer, for fast reads and session storage. Next.js was selected for its out of the box tools and capabilities it provide for Harmony such as SSR. 

---

## 9. APIs

### 9.1 Module M3: Public API

#### 9.1.1 CL-C3.1 PublicChannelController

**Public Methods (Unauthenticated):**

```typescript
// Get public channel with initial messages (SSR)
// GET /c/{serverSlug}/{channelSlug}
getPublicChannelPage(
  serverSlug: string,           // URL-safe server identifier
  channelSlug: string,          // URL-safe channel identifier
  query: {
    m?: string,                 // Optional message ID to highlight
    page?: number               // Optional page number
  }
): Promise<SSRPageResponse>     // Full HTML page with hydration data

// Get public channel messages (API for infinite scroll)
// GET /api/public/channels/{channelId}/messages
getPublicMessages(
  channelId: string,            // UUID of the channel
  query: {
    page: number,               // Page number (1-indexed)
    limit: number,              // Messages per page (max 100)
    before?: string,            // Cursor: message ID to fetch before
    after?: string              // Cursor: message ID to fetch after
  }
): Promise<PublicMessagesResponse>

// Get single message by ID (for deep links)
// GET /api/public/channels/{channelId}/messages/{messageId}
getPublicMessage(
  channelId: string,
  messageId: string
): Promise<PublicMessageResponse>
```

**Private Methods:**

```typescript
private validateChannelAccess(
  channelId: string
): Promise<VisibilityStatus>

private buildPublicMessageDTO(
  message: Message,
  author: User
): PublicMessageDTO

private applyContentFilters(
  messages: Message[]
): Message[]
```

#### 9.1.2 CL-C3.2 PublicServerController

**Public Methods (Unauthenticated):**

```typescript
// Get public server info
// GET /api/public/servers/{serverSlug}
getPublicServerInfo(
  serverSlug: string
): Promise<PublicServerDTO>

// Get list of public channels in server
// GET /api/public/servers/{serverSlug}/channels
getPublicChannelList(
  serverSlug: string
): Promise<PublicChannelDTO[]>

// Get server landing page (SSR)
// GET /s/{serverSlug}
getServerLandingPage(
  serverSlug: string
): Promise<SSRPageResponse>
```

### 9.2 Module M4: Access Control

#### 9.2.1 CL-C4.1 VisibilityGuard

**Public Methods:**

```typescript
// Check if channel is publicly accessible
isChannelPublic(
  channelId: string
): Promise<boolean>

// Check if server has any public channels
isServerPublic(
  serverId: string
): Promise<boolean>

// Get detailed visibility status
getVisibilityStatus(
  channelId: string
): Promise<VisibilityStatus>
// Returns: { isPublic, visibility, indexable, reason }
```

#### 9.2.2 CL-C4.2 ContentFilter

**Public Methods:**

```typescript
// Filter sensitive content from messages
filterSensitiveContent(
  content: string
): string

// Redact @mentions to non-public users
redactUserMentions(
  content: string,
  publicUserIds: Set<string>
): string

// Sanitize HTML content for safe display
sanitizeForDisplay(
  content: string
): string

// Check if attachments can be shown publicly
sanitizeAttachments(
  attachments: Attachment[]
): PublicAttachment[]
```

#### 9.2.3 CL-C4.3 RateLimiter

**Public Methods:**

```typescript
// Check if request should be rate limited
checkLimit(
  identifier: string,           // IP or fingerprint
  endpoint: string
): Promise<RateLimitResult>
// Returns: { allowed, remaining, resetAt }

// Record a request
incrementCounter(
  identifier: string,
  endpoint: string
): Promise<void>

// Check if currently rate limited
isRateLimited(
  identifier: string
): Promise<boolean>
```

#### 9.2.4 CL-C4.4 AnonymousSessionManager

**Public Methods:**

```typescript
// Get or create anonymous session
getOrCreateSession(
  request: Request
): Promise<GuestSession>

// Store preference for guest
storePreference(
  sessionId: string,
  key: string,
  value: unknown
): Promise<void>

// Get guest preferences
getPreferences(
  sessionId: string
): Promise<GuestPreferences>
```

### 9.3 Module M5: Content Delivery

#### 9.3.1 CL-C5.1 MessageService

**Public Methods:**

```typescript
// Get messages formatted for public view
getMessagesForPublicView(
  channelId: string,
  options: {
    page: number,
    limit: number,
    before?: string,
    after?: string
  }
): Promise<{
  messages: PublicMessageDTO[],
  hasMore: boolean,
  total: number
}>

// Get single message by ID
getMessageById(
  messageId: string
): Promise<PublicMessageDTO | null>
```

**Private Methods:**

```typescript
private buildMessageDTO(
  message: Message
): PublicMessageDTO

private enrichWithAuthor(
  message: Message
): Promise<MessageWithAuthor>
```

#### 9.3.2 CL-C5.2 AuthorService

**Public Methods:**

```typescript
// Get public author info (no user ID)
getPublicAuthorInfo(
  userId: string
): Promise<PublicAuthorDTO>

// Anonymize author if they opted out
anonymizeAuthor(
  user: User
): PublicAuthorDTO

// Get display name respecting privacy
getDisplayName(
  user: User
): string
```

#### 9.3.3 CL-C5.3 AttachmentService

**Public Methods:**

```typescript
// Get public URL for attachment
getPublicAttachmentUrl(
  attachmentId: string
): Promise<string | null>

// Generate thumbnail for image
generateThumbnail(
  attachmentId: string,
  size: ThumbnailSize
): Promise<string>

// Check if attachment can be public
isAttachmentPublic(
  attachment: Attachment
): boolean
```

#### 9.3.4 CL-C5.4 SEOService

**Public Methods:**

```typescript
// Generate page title
generatePageTitle(
  server: Server,
  channel: Channel,
  message?: Message
): string

// Generate meta description
generateDescription(
  channel: Channel,
  recentMessages: Message[]
): string

// Generate JSON-LD structured data
generateStructuredData(
  server: Server,
  channel: Channel,
  messages: Message[]
): StructuredData

// Generate breadcrumb data
generateBreadcrumbs(
  server: Server,
  channel: Channel
): BreadcrumbList

// Get canonical URL
getCanonicalUrl(
  serverSlug: string,
  channelSlug: string,
  messageId?: string
): string
```

### 9.4 Module M6: Data Access

#### 9.4.1 CL-C6.1 ChannelRepository

**Public Methods:**

```typescript
// Find channel by ID (shared with toggle spec)
findById(
  channelId: string
): Promise<Channel | null>

// Find channel by slug
findBySlug(
  serverSlug: string,
  channelSlug: string
): Promise<Channel | null>

// Update channel (shared with toggle spec)
update(
  channelId: string,
  data: Partial<Channel>
): Promise<Channel>

// Find all public channels for server
findPublicByServerId(
  serverId: string
): Promise<Channel[]>

// Get visibility directly
getVisibility(
  channelId: string
): Promise<ChannelVisibility>

// Get channel metadata (shared with toggle spec)
getMetadata(
  channelId: string
): Promise<ChannelMetadata>

// Invalidate channel cache entries (shared with toggle spec)
invalidateCache(
  channelId: string
): Promise<void>
```

> **Note:** `ChannelRepository` is shared across specs. The toggle spec is the canonical owner of `findById`, `update`, `getMetadata`, and `invalidateCache`. This spec primarily uses `findBySlug`, `findPublicByServerId`, and `getVisibility`.

#### 9.4.2 CL-C6.2 MessageRepository

**Public Methods:**

```typescript
// Find messages with pagination
findByChannelPaginated(
  channelId: string,
  options: PaginationOptions
): Promise<PaginatedResult<Message>>

// Find single message
findById(
  messageId: string
): Promise<Message | null>

// Count messages in channel
countByChannel(
  channelId: string
): Promise<number>
```

### 9.5 Rate Limiting

| Consumer Type | Limit | Window | Enforcement |
|--------------|-------|--------|-------------|
| Human (anonymous) | 100 requests | 1 minute | Token bucket per IP |
| Verified bot (Googlebot, Bingbot, etc.) | 1000 requests | 1 minute | User-Agent verification |
| Suspicious pattern | CAPTCHA challenge | After 500 page views/hour | Behavioral analysis |

### 9.6 Pagination Precedence

When both cursor and page parameters are provided, cursor-based pagination takes precedence:

1. If `before` or `after` (cursor) is provided, use cursor-based pagination (ignore `page`)
2. Otherwise, fall back to offset-based pagination using `page` and `limit`
3. Default: `page=1`, `limit=50`

### Rationale

The APIs for Guest Public Channel View, clearly handle the usage of the feature for being able to publicily access channels that are from the original search message. The first section APIs' purpose is for handling showing the information for the channel in which was derived from the search query and being able to load further messages in the channel. Next section APIs' purpose is for handling the server information once there, such as showing the server information and other public channels inside that server.

---

## 10. Public Interfaces

### 10.1 Cross-Module Interface Usage

#### Used by Public View Module (M1, M2) from Public API (M3):

| Method | Class | Used For |
|--------|-------|----------|
| getPublicChannelPage() | PublicChannelController | SSR page rendering |
| getPublicMessages() | PublicChannelController | Infinite scroll API |
| getPublicMessage() | PublicChannelController | Deep link to single message |
| getPublicServerInfo() | PublicServerController | Server sidebar |
| getPublicChannelList() | PublicServerController | Channel navigation |
| getServerLandingPage() | PublicServerController | Server landing page SSR |

#### Used by Public API (M3) from Access Control (M4):

| Method | Class | Used For |
|--------|-------|----------|
| isChannelPublic() | VisibilityGuard | Access check before serving |
| getVisibilityStatus() | VisibilityGuard | Detailed visibility info |
| filterSensitiveContent() | ContentFilter | Message sanitization |
| redactUserMentions() | ContentFilter | Privacy protection |
| sanitizeForDisplay() | ContentFilter | HTML sanitization for safe display |
| sanitizeAttachments() | ContentFilter | Attachment visibility filtering |
| checkLimit() | RateLimiter | Abuse prevention |
| incrementCounter() | RateLimiter | Recording requests for rate limiting |
| getOrCreateSession() | AnonymousSessionManager | Guest session management |
| storePreference() | AnonymousSessionManager | Storing guest preferences |
| getPreferences() | AnonymousSessionManager | Retrieving guest preferences |

#### Used by Public API (M3) from Content Delivery (M5):

| Method | Class | Used For |
|--------|-------|----------|
| getMessagesForPublicView() | MessageService | Fetching messages |
| getMessageById() | MessageService | Fetching single message for deep links |
| getPublicAuthorInfo() | AuthorService | Author display data |
| anonymizeAuthor() | AuthorService | Anonymizing opted-out authors |
| getDisplayName() | AuthorService | Privacy-respecting display names |
| generatePageTitle() | SEOService | SEO metadata |
| generateDescription() | SEOService | Meta description generation |
| generateStructuredData() | SEOService | JSON-LD |
| generateBreadcrumbs() | SEOService | Breadcrumb schema data |
| getCanonicalUrl() | SEOService | Canonical URL generation |
| getPublicAttachmentUrl() | AttachmentService | Attachment URLs |
| generateThumbnail() | AttachmentService | Image thumbnail generation |
| isAttachmentPublic() | AttachmentService | Attachment visibility check |

#### Used by Content Delivery (M5) from Data Access (M6):

| Method | Class | Used For |
|--------|-------|----------|
| findBySlug() | ChannelRepository | Channel lookup |
| findPublicByServerId() | ChannelRepository | Public channel listing for server |
| getVisibility() | ChannelRepository | Channel visibility check |
| findByChannelPaginated() | MessageRepository | Paginated message fetching |
| findById() | MessageRepository | Single message lookup |
| countByChannel() | MessageRepository | Message count for channel |
| getPublicProfile() | UserRepository | Author info |
| findById() | UserRepository | User lookup by ID |

### 10.2 REST API Interface

```yaml
openapi: 3.0.3
info:
  title: Harmony Public Channel API
  version: 1.0.0
  description: Unauthenticated API for accessing public channel content

paths:
  /api/public/channels/{channelId}/messages:
    get:
      summary: Get public messages from a channel
      description: Returns paginated messages for public viewing. No authentication required.
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 50
        - name: before
          in: query
          description: Fetch messages before this message ID
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Messages retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PublicMessagesResponse'
          headers:
            Cache-Control:
              schema:
                type: string
                example: "public, max-age=60, s-maxage=60"
            X-RateLimit-Remaining:
              schema:
                type: integer
        '403':
          description: Channel is not public
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AccessDeniedResponse'
        '404':
          description: Channel not found
        '429':
          description: Rate limit exceeded

  /api/public/servers/{serverSlug}:
    get:
      summary: Get public server information
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Server info retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PublicServerDTO'
        '404':
          description: Server not found or not public

  /api/public/channels/{channelId}/messages/{messageId}:
    get:
      summary: Get single public message (deep link)
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: messageId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Message retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PublicMessageDTO'
        '403':
          description: Channel is not public
        '404':
          description: Message or channel not found

  /api/public/servers/{serverSlug}/channels:
    get:
      summary: Get list of public channels in server
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Public channels listed
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PublicChannelDTO'
        '404':
          description: Server not found or not public

  /s/{serverSlug}:
    get:
      summary: Server landing page (SSR)
      description: Renders server landing page with list of public channels
      parameters:
        - name: serverSlug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Server landing page HTML
          content:
            text/html:
              schema:
                type: string
        '404':
          description: Server not found or not public

components:
  schemas:
    PublicMessagesResponse:
      type: object
      properties:
        messages:
          type: array
          items:
            $ref: '#/components/schemas/PublicMessageDTO'
        pagination:
          type: object
          properties:
            page:
              type: integer
            limit:
              type: integer
            total:
              type: integer
            hasMore:
              type: boolean
            nextCursor:
              type: string

    PublicMessageDTO:
      type: object
      properties:
        id:
          type: string
          format: uuid
        content:
          type: string
          description: Sanitized message content
        author:
          $ref: '#/components/schemas/PublicAuthorDTO'
        timestamp:
          type: string
          format: date-time
        editedAt:
          type: string
          format: date-time
          nullable: true
        attachments:
          type: array
          items:
            $ref: '#/components/schemas/PublicAttachmentDTO'
        permalink:
          type: string
          format: uri
          description: Direct link to this message

    PublicAuthorDTO:
      type: object
      description: Author info without exposing user ID
      properties:
        displayName:
          type: string
        avatarUrl:
          type: string
          format: uri
          nullable: true
        isBot:
          type: boolean

    PublicAttachmentDTO:
      type: object
      properties:
        id:
          type: string
        filename:
          type: string
        url:
          type: string
          format: uri
        contentType:
          type: string
        thumbnailUrl:
          type: string
          format: uri
          nullable: true

    PublicServerDTO:
      type: object
      properties:
        name:
          type: string
        slug:
          type: string
        description:
          type: string
        iconUrl:
          type: string
          format: uri
        memberCount:
          type: integer
        publicChannelCount:
          type: integer

    AccessDeniedResponse:
      type: object
      properties:
        error:
          type: string
          example: "CHANNEL_NOT_PUBLIC"
        message:
          type: string
          example: "This channel requires membership to view"
        serverSlug:
          type: string
          description: Server slug for redirect (if server is public)
```

### 10.3 Cross-Spec Event Integration

When `VISIBILITY_CHANGED` is emitted by the Channel Visibility Toggle spec:

| New Visibility | Downstream Action (Guest View Spec) |
|---------------|--------------------------------------|
| `PUBLIC_INDEXABLE` | Warm guest view cache for channel |
| `PUBLIC_NO_INDEX` | Keep guest view cache (public content, but update X-Robots-Tag) |
| `PRIVATE` | Invalidate guest view cache; return 403/404 |

### 10.4 Rationale 

The public interfaces categories appropriately define the public method this featur needs for other modules to intercat with. For the public api, the public method serve its purpose for providing the necessary entry points other modules need to allow guests to view public channels without logging in. The access controls purpose is to protect private channels from being accessed by guests, verifying that the channel is public. Content delivery and data access purpose is guest receiving the public information the channel has. 

---

## 11. Data Schemas

### 11.1 Database Tables

#### D7.1 ServersTable

**Runtime Class:** CL-D9 Server

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique server identifier | 16 bytes |
| name | VARCHAR(100) | NOT NULL | Display name | ~40 bytes |
| slug | VARCHAR(100) | NOT NULL, UNIQUE, INDEX | URL-safe identifier | ~30 bytes |
| description | TEXT | NULL | Server description | ~200 bytes |
| icon_url | VARCHAR(500) | NULL | Server icon URL | ~100 bytes |
| is_public | BOOLEAN | NOT NULL, DEFAULT FALSE | Whether server appears in discovery | 1 byte |
| member_count | INTEGER | NOT NULL, DEFAULT 0 | Cached member count | 4 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Creation time | 8 bytes |

**Indexes:**
```sql
CREATE INDEX idx_servers_slug ON servers(slug);
CREATE INDEX idx_servers_public ON servers(is_public) WHERE is_public = true;
```

**Storage Estimate:** ~400 bytes per server

#### D7.2 ChannelsTable

**Runtime Class:** CL-D7 Channel

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique channel identifier | 16 bytes |
| server_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent server | 16 bytes |
| name | VARCHAR(100) | NOT NULL | Display name | ~40 bytes |
| slug | VARCHAR(100) | NOT NULL, INDEX | URL-safe identifier (unique per server) | ~30 bytes |
| visibility | visibility_enum | NOT NULL, DEFAULT 'PRIVATE' | Visibility state | 1 byte |
| topic | TEXT | NULL | Channel topic/description | ~100 bytes |
| position | INTEGER | NOT NULL, DEFAULT 0 | Sort order | 4 bytes |
| indexed_at | TIMESTAMP WITH TIME ZONE | NULL | When channel was added to sitemap | 8 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation time | 8 bytes |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last modification timestamp | 8 bytes |

> **Note:** `messageCount` (shown in `PublicChannelDTO`) is computed via `COUNT(*)` query on the messages table, not stored as a column. The `visibility` column uses the `visibility_enum` type (not a boolean); see toggle spec for the `is_public` boolean on the `servers` table.

**Indexes (Canonical Set — merged from all specs):**
```sql
-- Composite index for server-scoped visibility queries (from toggle spec)
CREATE INDEX idx_channels_server_visibility ON channels(server_id, visibility);

-- Unique slug per server
CREATE UNIQUE INDEX idx_channels_server_slug ON channels(server_id, slug);

-- Partial index for all public channels (guest view queries)
CREATE INDEX idx_channels_visibility ON channels(visibility)
  WHERE visibility IN ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX');

-- Partial index for indexable channels (sitemap generation, from toggle spec)
CREATE INDEX idx_channels_visibility_indexed ON channels(visibility, indexed_at)
  WHERE visibility = 'PUBLIC_INDEXABLE';
```

**Storage Estimate:** ~239 bytes per channel

#### D7.3 MessagesTable

**Runtime Class:** CL-D8 Message

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique message identifier | 16 bytes |
| channel_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent channel | 16 bytes |
| author_id | UUID | FOREIGN KEY, NOT NULL | Message author | 16 bytes |
| content | TEXT | NOT NULL | Message content | ~500 bytes avg |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, INDEX | Creation time | 8 bytes |
| edited_at | TIMESTAMP WITH TIME ZONE | NULL | Last edit time | 8 bytes |
| is_deleted | BOOLEAN | NOT NULL, DEFAULT FALSE | Soft delete flag | 1 byte |

**Indexes:**
```sql
CREATE INDEX idx_messages_channel_time ON messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_channel_not_deleted ON messages(channel_id, created_at DESC)
  WHERE is_deleted = false;
```

**Storage Estimate:** ~565 bytes per message

#### D7.4 UsersTable

**Runtime Class:** CL-D10 User

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique user identifier | 16 bytes |
| username | VARCHAR(32) | NOT NULL, UNIQUE | Login username | ~20 bytes |
| display_name | VARCHAR(100) | NOT NULL | Public display name | ~40 bytes |
| avatar_url | VARCHAR(500) | NULL | Avatar image URL | ~100 bytes |
| public_profile | BOOLEAN | NOT NULL, DEFAULT TRUE | Show in public channels | 1 byte |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Registration time | 8 bytes |

**Storage Estimate:** ~185 bytes per user

#### D7.5 AttachmentsTable

**Runtime Class:** CL-D11 Attachment

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique attachment identifier | 16 bytes |
| message_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Parent message | 16 bytes |
| filename | VARCHAR(255) | NOT NULL | Original filename | ~50 bytes |
| url | VARCHAR(500) | NOT NULL | Storage URL | ~150 bytes |
| content_type | VARCHAR(100) | NOT NULL | MIME type | ~30 bytes |
| size_bytes | BIGINT | NOT NULL | File size | 8 bytes |

**Storage Estimate:** ~270 bytes per attachment

### 11.2 Cache Schemas

#### D8.1 ChannelVisibilityCache

**Key Pattern:** `channel:{channelId}:visibility`
**Value Type:** String (enum value: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`)
**TTL:** 3600 seconds (1 hour)
**Invalidation:** On visibility change via admin toggle

#### D8.2 PublicMessagesCache

**Key Pattern:** `channel:msgs:{channelId}:page:{pageNum}`
**Value Type:** JSON array of PublicMessageDTO
**TTL:** 60 seconds
**Invalidation:** On new message in channel

#### D8.3 ServerInfoCache

**Key Pattern:** `server:{serverId}:info`
**Value Type:** JSON PublicServerDTO
**TTL:** 300 seconds (5 minutes)
**Invalidation:** On server info update

#### D8.4 GuestSessionCache

**Key Pattern:** `guest:session:{sessionId}`
**Value Type:** JSON `{ preferences: object, createdAt: timestamp }`
**TTL:** 86400 seconds (24 hours)
**Purpose:** Store guest preferences (dismissed banners, etc.)

### 11.3 Storage Estimates

| Data Type | Records (Est.) | Per Record | Total Est. | Growth Rate |
|-----------|---------------|------------|------------|-------------|
| Servers | 10,000 | 400 bytes | 4 MB | 100/month |
| Channels | 100,000 | 215 bytes | 21.5 MB | 1,000/month |
| Messages | 100,000,000 | 565 bytes | 56.5 GB | 1M/month |
| Users | 1,000,000 | 185 bytes | 185 MB | 10,000/month |
| Attachments | 10,000,000 | 270 bytes | 2.7 GB | 100,000/month |

### 11.4 Rationale 

The data schemas covers the data required for rendering the feature of public channel view. The three important tables needed being server, channels, and messages, all handle the public information that guests will be given, however the schemas clearly denote the information that will be given to guests only, meaning guests that haven't logged in. 

---

## 12. Security and Privacy

### 12.1 Temporarily Stored PII

| PII Type | Justification | Entry Point | Processing Path | Disposal | Protection |
|----------|---------------|-------------|-----------------|----------|------------|
| IP Address | Rate limiting, abuse prevention | HTTP request | RateLimiter -> Redis | TTL expiry (1 hour) | Not logged in plaintext; stored as SHA-256 hash for rate limit bucket keys |
| User Agent | Bot detection | HTTP request | BotDetector | Not stored | Used only for classification |
| Search Terms (from referrer) | Feature: highlight matching terms | HTTP Referer header | SearchHighlighter (client-side only) | Not sent to server | Client-side only; not logged |

### 12.2 Long-Term Stored PII Exposure

| PII Type | Stored Location | Exposure in Public View | Mitigation |
|----------|-----------------|------------------------|------------|
| User ID | D7.3 Messages.author_id | NOT exposed in PublicAuthorDTO | Stripped at AuthorService layer |
| Username | D7.4 Users.username | NOT exposed | Only display_name shown |
| Display Name | D7.4 Users.display_name | Exposed (user's choice) | User can opt out via public_profile |
| Avatar URL | D7.4 Users.avatar_url | Exposed (user's choice) | User can opt out via public_profile |
| Message Content | D7.3 Messages.content | Exposed (in public channels) | Content filter applied |

### 12.3 Privacy Controls

**User Privacy Settings:**
- `public_profile` flag: If false, author shown as "Anonymous" in public views
- Users can delete messages (soft delete, not shown in public view)
- Users can edit messages (edited_at shown in public view)

**Content Filtering:**
- @mentions of users with `public_profile=false` are redacted
- Email addresses detected and redacted
- Phone numbers detected and redacted
- Private channel links filtered out

### 12.4 Data Flow for Public View

```mermaid
flowchart LR
    subgraph DB["Database"]
        MsgTable["Messages table\n(id, channel_id, author_id,\ncontent, created_at, is_deleted)"]
        UsersTable["Users table\n(id, username, display_name,\navatar_url, public_profile)"]
    end

    subgraph Server["Server"]
        MsgService["MessageService\n- id → kept\n- channel_id → filtered out\n- author_id → lookup user\n- content → filter content\n- created_at → kept\n- is_deleted → if true, skip"]
        AuthService["AuthorService\n- id → NOT exposed\n- username → NOT exposed\n- display_name → getDisplayName()\n- avatar_url → if public_profile=true\n- public_profile → check flag\n\nIf public_profile=false:\n  displayName='Anonymous'\n  avatarUrl=null"]
    end

    subgraph Client["Client"]
        MsgDTO["PublicMessageDTO\n(id, content, timestamp,\nauthor: PublicAuthorDTO)"]
        AuthorDTO["PublicAuthorDTO\n(displayName, avatarUrl)\n[no userId exposed]"]
    end

    MsgTable --> MsgService --> MsgDTO
    UsersTable --> AuthService --> AuthorDTO
    MsgService --> AuthService
```

### 12.5 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 12.6 Bot and Abuse Protection

| Protection | Implementation | Threshold |
|------------|----------------|-----------|
| Rate Limiting | Token bucket per IP | 100 req/min for humans, 1000 req/min for verified bots |
| Bot Detection | User-Agent analysis | Verified bots whitelisted |
| Scraping Prevention | CAPTCHA on suspicious patterns | After 500 page views/hour |
| DDoS Protection | CloudFlare WAF | Automatic |

### 12.7 Customer-Visible Privacy Policy Points

- Messages in public channels are visible to anyone, including search engines
- Your display name and avatar appear with your messages in public channels
- You can opt out of public display by setting your profile to private
- We do not track or store identifying information about anonymous viewers
- Search engines may cache public content; cached content remains after channel is made private

### 12.8 Guest User Restrictions

| Action | Allowed | Notes |
|--------|---------|-------|
| View public channel messages | Yes | Core feature |
| View public channel attachments | Yes | If attachment is in a public channel |
| Navigate between public channels | Yes | Via server sidebar |
| Copy message permalink | Yes | Client-side only |
| Share message/channel link | Yes | Client-side only |
| Send messages | No | Requires authentication |
| React to messages | No | Requires authentication |
| View private channels | No | Returns 403/404 |
| View member list | No | Privacy protection |
| Access user profiles | No | Only public display name and avatar shown inline |
| Download message history | No | Not exposed to guests |
| Use search within channel | No | Not available for guests (future feature) |

### 12.9 Rationale 

The security and privacy answers obvious concerns for handling messages that are publicily accessible to anyone. The restriction on guest users are enforced for security purposes such as not being able to interact with the channel without verifying who you are, meaning public channels are read only. Privacy purposes users who send messages in public channels can opt out of revealing their profile information and instead have it be anonymous. 

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T3: Next.js SSR | Medium | Medium | Medium | Medium | Medium |
| T11: CloudFlare Edge | Medium | High | Medium | High | Low |
| T17: sanitize-html | Low | Low | Low | Medium | Low |
| T18: schema-dts | Low | Medium | Low | Medium | Low |
| T20: sharp | Low | Low | Low | Low | Low |
| T21: Lighthouse CI | Medium | Low | Medium | N/A | Low |

### 13.2 Component Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| SSR Performance | Slow TTFB affects SEO | Edge caching; ISR; streaming |
| Content Filtering | Regex performance on large content | Timeouts; message size limits |
| Infinite Scroll | SEO crawlers can't follow | Pagination fallback links; sitemap |
| Cache Invalidation | Stale content shown | Short TTLs; explicit invalidation |
| Bot Detection | False positives block real users | Verify bot list; appeal process |

### 13.3 SEO-Specific Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| JavaScript-dependent content | Crawlers may not execute JS | SSR for all content |
| Slow page load | Poor Core Web Vitals | Edge caching; image optimization |
| Duplicate content | Ranking penalty | Canonical URLs; proper pagination |
| Thin content pages | Not indexed | Minimum message threshold for indexing |
| Frequent content changes | Crawl budget waste | Last-modified headers; sitemap priority |

### 13.4 Off-the-Shelf Considerations

| Technology | Customization | Source | Support | Cost |
|------------|---------------|--------|---------|------|
| Next.js | SSR config, caching | Open source | Vercel paid | Free |
| CloudFlare | Edge rules, workers | SaaS | Paid tiers | $20+/mo |
| sanitize-html | None needed | Open source | Community | Free |
| Lighthouse CI | Thresholds | Open source | Community | Free |

### 13.5 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| SSR overload | > 2s TTFB p95 | Increase ISR; reduce initial messages |
| Cache stampede | Origin overload on cache miss | Stale-while-revalidate; request coalescing |
| Privacy incident | PII leaked in public view | Immediate hotfix; user notification |
| SEO ranking drop | > 20% traffic decrease | Audit with Search Console; fix issues |

### 13.6 Rationale 

The risks to completion covers the fact that an assessment was done on the tech stack chosen for learning curve, maintainability, and long term viability. The technology chosen are well documentated and have ongoing support, reducing any future risk for developing Harmony. 

---

## Appendix A: SEO Optimization Checklist

### Page Structure
- [ ] Unique, descriptive `<title>` per page
- [ ] Meta description under 160 characters
- [ ] Canonical URL on every page
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (DiscussionForumPosting)
- [ ] Breadcrumb schema

### Technical SEO
- [ ] Server-side rendering for all content
- [ ] Mobile-responsive design
- [ ] Fast TTFB (< 500ms)
- [ ] Core Web Vitals passing
- [ ] XML sitemap including all public channels
- [ ] robots.txt allowing crawlers
- [ ] Proper HTTP status codes (404 for missing, 403 for private)

### Content Accessibility
- [ ] All messages readable without JavaScript
- [ ] Pagination with `<link rel="next/prev">`
- [ ] Deep links to specific messages work
- [ ] Images have alt text
- [ ] Semantic HTML structure

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| SSR | Server-Side Rendering - generating HTML on the server before sending to client |
| TTFB | Time to First Byte - time until browser receives first byte of response |
| ISR | Incremental Static Regeneration - Next.js feature for updating static pages |
| Hydration | Process of attaching JavaScript event handlers to server-rendered HTML |
| Core Web Vitals | Google's metrics for page experience (LCP, FID, CLS) |
| JSON-LD | JavaScript Object Notation for Linked Data - structured data format |
| Canonical URL | The preferred URL for a page to avoid duplicate content issues |
| Stale-While-Revalidate | Cache strategy serving stale content while fetching fresh |
| Edge Worker | Code running at CDN edge locations |
| Guest User | Anonymous visitor without an account |
| EventBus | Redis Pub/Sub messaging layer for cross-service event communication |
| tRPC | End-to-end typesafe API framework for TypeScript; used for authenticated internal APIs |
| Visibility Enum | `ChannelVisibility` enum with values: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |

---

## Appendix C: Document References

- Dev Spec: Channel Visibility Toggle (cross-referenced for cache keys, ChannelRepository, EventBus, and `channels` table schema)
- Dev Spec: SEO Meta Tag Generation (cross-referenced for event integration and MetaTagService)
- Platform Architecture Overview (separate document)
- Harmony Security Policy (separate document)
