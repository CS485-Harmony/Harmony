# Development Specification: SEO Meta Tag Generation

## Feature: Automatic HTML Meta Tag Generation for Public Threads

**User Story:** As a Content Creator, I want public threads to automatically generate HTML meta tags (Title, Description) based on the conversation content, so that my community appears with relevant previews in Google search results, driving organic growth.

---

## 1 Header

### 1.1 Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Update to address comments and fix inconsistencies        |

### 1.2 Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0     |
| dblanc        | Project Lead            | 1.0     |
| acabrera04    | Project Lead            | 2.0     |
| CoPilot (AI)  | Specification Editor     | 2.0     |

---

### 1.3 Rationale
Header with versioning and authors.

## 2. Architecture Diagram

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────┐  Module/Component    ─────►  Data Flow                                │
│  │      │                      ─ ─ ─►  Async/Background Flow                    │
│  └──────┘                      ══════  Bidirectional Flow                       │
│  [      ]  External System     Blue: Client   Green: Server   Orange: External  │
│  (      )  Data Store          Purple: AI/ML Services                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL ACTORS                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                       │
│  │ [A1 Search Engine Bot]  │  │ [A2 Social Media        │                       │
│  │ Googlebot, Bingbot      │  │ Crawler]                │                       │
│  │ Crawls pages, reads     │  │ Facebook, Twitter,      │                       │
│  │ meta tags               │  │ LinkedIn link previews  │                       │
│  └───────────┬─────────────┘  └───────────┬─────────────┘                       │
└──────────────┼────────────────────────────┼─────────────────────────────────────┘
               │                            │
               │ Request page               │ Request page/OG tags
               ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER (Application Server)                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M1 Page Rendering Module (Next.js SSR)                                    │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C1.1 PublicChannelPage      │    │ C1.2 HeadComponent              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ serverSlug: string          │    │ meta: MetaTagSet                │   │  │
│  │  │ channelSlug: string         │    │ ─────────────────────────────── │   │  │
│  │  │ messages: Message[]         │    │ renderMetaTags()                │   │  │
│  │  │ metaTags: MetaTagSet        │    │ renderOpenGraph()               │   │  │
│  │  │ ─────────────────────────── │    │ renderTwitterCards()            │   │  │
│  │  │ getServerSideProps()        │───►│ renderStructuredData()          │   │  │
│  │  │ render()                    │    │ renderCanonical()               │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M2 Meta Tag Generation Module                                             │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C2.1 MetaTagService         │    │ C2.2 TitleGenerator             │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ titleGenerator: ref         │    │ maxLength: 60                   │   │  │
│  │  │ descriptionGenerator: ref   │    │ ─────────────────────────────── │   │  │
│  │  │ openGraphGenerator: ref     │    │ generateFromChannel()           │   │  │
│  │  │ structuredDataGen: ref      │    │ generateFromMessage()           │   │  │
│  │  │ cacheService: ref           │    │ generateFromThread()            │   │  │
│  │  │ contentAnalyzer: ref        │    │ truncateWithEllipsis()          │   │  │
│  │  │ ─────────────────────────── │    │ sanitizeForTitle()              │   │  │
│  │  │ generateMetaTags()          │◄───│ applyTemplate()                 │   │  │
│  │  │ getOrGenerateCached()       │    └─────────────────────────────────┘   │  │
│  │  │ invalidateCache()           │                                          │  │
│  │  │ scheduleRegeneration()      │                                          │  │
│  │  │ getMetaTagsForPreview()     │                                          │  │
│  │  │ getRegenerationJobStatus()  │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C2.4 OpenGraphGenerator         │   │  │
│  │  │ C2.3 DescriptionGenerator   │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ defaultImage: string            │   │  │
│  │  │ maxLength: 160              │    │ ─────────────────────────────── │   │  │
│  │  │ minLength: 50               │    │ generateOGTags()                │   │  │
│  │  │ ─────────────────────────── │    │ generateTwitterCard()           │   │  │
│  │  │ generateFromMessages()      │    │ selectPreviewImage()            │   │  │
│  │  │ extractKeyPhrases()         │    └─────────────────────────────────┘   │  │
│  │  │ summarizeThread()           │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C2.6 MetaTagCache               │   │  │
│  │  │ C2.5 StructuredDataGen      │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ cache: Redis                    │   │  │
│  │  │ ─────────────────────────── │    │ ttl: number                     │   │  │
│  │  │ generateDiscussionForum()   │    │ ─────────────────────────────── │   │  │
│  │  │ generateBreadcrumbList()    │    │ get()                           │   │  │
│  │  │ generateOrganization()      │    │ set()                           │   │  │
│  │  │ generateWebPage()           │    │ invalidate()                    │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M3 Content Analysis Module                                                │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C3.1 ContentAnalyzer        │    │ C3.2 KeywordExtractor           │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ keywordExtractor: ref       │    │ stopWords: Set<string>          │   │  │
│  │  │ summarizer: ref             │    │ ─────────────────────────────── │   │  │
│  │  │ topicClassifier: ref         │    │ extractKeywords()               │   │  │
│  │  │ ─────────────────────────── │    │ extractPhrases()                │   │  │
│  │  │ analyzeThread()             │───►│ scoreByFrequency()              │   │  │
│  │  │ getTopicCategory()          │    └─────────────────────────────────┘   │  │
│  │  │ getSentiment()              │                                          │  │
│  │  │ getReadingLevel()           │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C3.4 TopicClassifier             │   │  │
│  │  │ C3.3 TextSummarizer         │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ categories: Category[]          │   │  │
│  │  │ maxSentences: number        │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ classify()                      │   │  │
│  │  │ summarize()                 │    │ getTop()                        │   │  │
│  │  │ extractFirstSentence()      │    │ getKeywords()                   │   │  │
│  │  │ extractKeySentences()       │    └─────────────────────────────────┘   │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M4 Background Processing Module                                           │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C4.1 MetaTagUpdateWorker    │    │ C4.2 EventListener              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ queue: JobQueue             │    │ eventBus: EventBus              │   │  │
│  │  │ metaTagService: ref         │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ onMessageCreated()              │   │  │
│  │  │ processJob()                │◄───│ onMessageEdited()               │   │  │
│  │  │ scheduleUpdate()            │    │ onMessageDeleted()              │   │  │
│  │  │ batchProcess()              │    │ onVisibilityChanged()           │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ C4.3 SitemapUpdater         │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ updateLastModified()         │                                          │  │
│  │  │ notifySearchEngines()       │                                          │  │
│  │  │ requestDeindex()            │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M5 Data Access Module                                                     │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C5.1 ChannelRepository      │    │ C5.2 MessageRepository          │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ database: DatabaseClient    │    │ database: DatabaseClient        │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ findById(), findBySlug(),     │    │ findRecentByChannel()            │   │  │
│  │  │ update(), findPublicByServer │    │ findFirstMessage()               │   │  │
│  │  │ Id(), getVisibility(),      │    │ getMessageCount()               │   │  │
│  │  │ getMetadata()               │    │                                 │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ C5.3 MetaTagRepository      │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ database: DatabaseClient    │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ findByChannelId()            │                                          │  │
│  │  │ upsert()                    │                                          │  │
│  │  │ getLastGenerated()          │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Database Protocol
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER (Cloud Infrastructure)                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M6 Persistence Module                                                     │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ D6.1 ChannelsTable          │    │ D6.2 MessagesTable              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ id: UUID (PK)               │    │ id: UUID (PK)                   │   │  │
│  │  │ server_id: UUID (FK)        │    │ channel_id: UUID (FK)           │   │  │
│  │  │ name: VARCHAR(100),         │    │ author_id: UUID (FK)            │   │  │
│  │  │ slug: VARCHAR(100)          │    │ content: TEXT                   │   │  │
│  │  │ visibility: ENUM            │    │ created_at: TIMESTAMP           │   │  │
│  │  │ topic: TEXT, position: INT  │    │ attachments: JSONB              │   │  │
│  │  │ indexed_at / created_at /   │    │                                 │   │  │
│  │  │ updated_at: TIMESTAMP       │    │                                 │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ D6.3 GeneratedMetaTagsTable │    │ D6.4 ServersTable               │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ id: UUID (PK)               │    │ id: UUID (PK)                   │   │  │
│  │  │ channel_id: UUID (FK,UNIQUE)│    │ name: VARCHAR(100)              │   │  │
│  │  │ title: VARCHAR(70)          │    │ slug: VARCHAR(100)              │   │  │
│  │  │ description: VARCHAR(200)   │    │ description: TEXT               │   │  │
│  │  │ og_title: VARCHAR(95)       │    │ icon_url: VARCHAR(500)          │   │  │
│  │  │ og_description: VARCHAR(300)│    └─────────────────────────────────┘   │  │
│  │  │ og_image: VARCHAR(500)      │                                          │  │
│  │  │ twitter_card: VARCHAR(20)   │                                          │  │
│  │  │ keywords: TEXT[]            │                                          │  │
│  │  │ structured_data: JSONB      │                                          │  │
│  │  │ custom_title: VARCHAR(70)   │                                          │  │
│  │  │ custom_description:         │                                          │  │
│  │  │   VARCHAR(200)              │                                          │  │
│  │  │ custom_og_image:            │                                          │  │
│  │  │   VARCHAR(500)              │                                          │  │
│  │  │ content_hash: VARCHAR(64)   │                                          │  │
│  │  │ needs_regeneration: BOOLEAN │                                          │  │
│  │  │ generated_at: TIMESTAMP     │                                          │  │
│  │  │ version: INTEGER            │                                          │  │
│  │  │ created_at / updated_at:    │                                          │  │
│  │  │   TIMESTAMP                 │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M7 Cache Module                                                           │  │
│  │  ┌──────────────────────────────┐    ┌──────────────────────────────────┐ │  │
│  │  │ D7.1 MetaTagCache            │    │ D7.2 ContentAnalysisCache        │ │  │
│  │  │ ───────────────────────────  │    │ ───────────────────────────────  │ │  │
│  │  │ key: meta:channel:{channelId}│    │ key: analysis:channel:{channelId}│ │  │
│  │  │ value: MetaTagSet            │    │ value: ContentAnalysis           │ │  │
│  │  │ ttl: 3600 seconds            │    │ ttl: 1800 seconds                │ │  │
│  │  └──────────────────────────────┘    └──────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M8 Job Queue Module                                                       │  │
│  │  ┌─────────────────────────────┐                                          │  │
│  │  │ D8.1 MetaTagUpdateQueue     │                                          │  │
│  │  │ ─────────────────────────── │                                          │  │
│  │  │ queue: meta-tag-updates     │                                          │  │
│  │  │ job: { jobId, channelId,    │                                          │  │
│  │  │   priority, triggeredBy,    │                                          │  │
│  │  │   idempotencyKey?, status,  │                                          │  │
│  │  │   attemptCount, lastError? }│                                          │  │
│  │  │ delay: 60 seconds (debounce)│                                          │  │
│  │  │ maxAttempts: 3              │                                          │  │
│  │  │ backoff: exponential        │                                          │  │
│  │  └─────────────────────────────┘                                          │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SYSTEMS                                      │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐           │
│  │ [E1 Google Search Console]  │  │ [E2 Bing Webmaster Tools]       │           │
│  │ Indexing API                │  │ URL Submission API              │           │
│  │ Sitemap ping                │  │ Sitemap ping                    │           │
│  └─────────────────────────────┘  └─────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Information Flow Summary

| Flow ID | Source | Destination | Data | Protocol |
|---------|--------|-------------|------|----------|
| F1 | A1 Search Engine Bot | C1.1 PublicChannelPage | HTTP GET Request | HTTPS |
| F2 | C1.1 PublicChannelPage | C2.1 MetaTagService | Meta tag request | Internal |
| F3 | C2.1 MetaTagService | C2.6 MetaTagCache | Cache lookup | Redis |
| F4 | C2.1 MetaTagService | C3.1 ContentAnalyzer | Content analysis | Internal |
| F5 | C3.1 ContentAnalyzer | C5.2 MessageRepository | Message fetch | Database |
| F6 | C2.1 MetaTagService | C5.3 MetaTagRepository | Persist generated tags | Database |
| F7 | C4.2 EventListener | C4.1 MetaTagUpdateWorker | Update job | Queue |
| F8 | C4.3 SitemapUpdater | E1/E2 Search Consoles | Ping notification | HTTPS |
| F9 | C1.2 HeadComponent | A1 Search Engine Bot | HTML <head> content | HTTPS |

### 2.3 Meta Tag Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Meta Tag Generation Pipeline                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

 Message Events                Content Analysis              Meta Tag Generation
 ─────────────                 ────────────────              ──────────────────
      │                              │                              │
      │  New message posted          │                              │
      ▼                              │                              │
┌─────────────┐                      │                              │
│ EventBus    │                      │                              │
│ emits       │                      │                              │
│ MESSAGE_    │                      │                              │
│ CREATED     │                      │                              │
└──────┬──────┘                      │                              │
       │                             │                              │
       │ Debounce (60s)              │                              │
       ▼                             │                              │
┌─────────────┐                      │                              │
│ Job Queue   │                      │                              │
│ schedules   │                      │                              │
│ update      │                      │                              │
└──────┬──────┘                      │                              │
       │                             │                              │
       │ Worker picks up job         │                              │
       ▼                             ▼                              │
┌─────────────┐              ┌─────────────────┐                    │
│ Fetch last  │─────────────►│ Extract keywords│                    │
│ N messages  │              │ from content    │                    │
│ from channel│              └────────┬────────┘                    │
└─────────────┘                       │                             │
                                      ▼                             │
                             ┌─────────────────┐                    │
                             │ Classify topic  │                    │
                             │ category        │                    │
                             └────────┬────────┘                    │
                                      │                             │
                                      ▼                             │
                             ┌─────────────────┐                    │
                             │ Summarize       │                    │
                             │ thread content  │                    │
                             └────────┬────────┘                    │
                                      │                             │
                                      │                             ▼
                                      │                    ┌─────────────────┐
                                      └───────────────────►│ Generate title  │
                                                           │ (max 60 chars)  │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Generate desc   │
                                                           │ (max 160 chars) │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Generate OG/    │
                                                           │ Twitter tags    │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Generate JSON-LD│
                                                           │ structured data │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Store in DB     │
                                                           │ and cache       │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Invalidate CDN  │
                                                           │ cache for page  │
                                                           └────────┬────────┘
                                                                    │
                                                                    ▼
                                                           ┌─────────────────┐
                                                           │ Ping search     │
                                                           │ engines         │
                                                           └─────────────────┘
```
### 2.4 Rationale
This gives us our overarching view of the spec. This feature is entirely behind the scenes which is why we are doing server side rendering since we are only interfacing with the search engine crawlers. 
We also have the clear seperation between the server and data layer which the LLM did a good job at creating the proper components.
We did have to reprompt to ensure that the diagram was aligned with the rest of the specification.

---

## 3. Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ────────►  Inheritance (extends)         ◆─────────  Composition               │
│  - - - - ►  Implementation (implements)   ◇─────────  Aggregation               │
└─────────────────────────────────────────────────────────────────────────────────┘

                            ┌───────────────────────────┐
                            │    <<interface>>          │
                            │   CL-I1 IMetaTagGenerator │
                            ├───────────────────────────┤
                            │ + generate(): MetaTagSet  │
                            │ + validate(): boolean     │
                            └──────────────┬────────────┘
                                           │
        ┌──────────────────────────────────┼───────────────────────────────────┐
        │                                  │                                   │
  - - - ┼ - - -                      - - - ┼ - - -                       - - - ┼ - - -
        │                                  │                                   │
┌───────▼─────────────────┐  ┌─────────────▼───────────────┐   ┌───────────────▼───────────┐
│ CL-C2.2 TitleGenerator. │  │ CL-C2.3 DescriptionGenerator│   │ CL-C2.4 OpenGraphGenerator│
├─────────────────────────┤  ├─────────────────────────────┤   ├───────────────────────────┤
│ - maxLength: 60         │  │ - maxLength: 160          │     │ - defaultImage: str       │
│ - templates: Template[] │  │ - minLength: 50           │     ├───────────────────────────┤
├─────────────────────────┤  ├─────────────────────────────┤   │ + generateOGTags()        │
│ + generateFromChannel() │  │ + generateFromMessages()  │     │ + generateTwitterCard()   │
│ + generateFromMessage() │  │ + extractKeyPhrases()     │     │ + selectPreviewImage()    │
│ + generateFromThread()  │  │ + summarizeThread()       │     └───────────────────────────┘
│ - truncateWithEllipsis()│  └─────────────────────────────┘
│ - sanitizeForTitle()    │
│ - applyTemplate()       │
└─────────────────────────┘


                            ┌─────────────────────────────┐
                            │ CL-C2.1 MetaTagService      │
                            │ <<Facade>>                  │
                            ├─────────────────────────────┤
                            │ - titleGen: ref             │
                            │ - descGen: ref              │
                            │ - ogGen: ref                │
                            │ - structuredGen: ref        │
                            │ - cache: ref                │
                            │ - analyzer: ref             │
                            ├─────────────────────────────┤
                            │ + generateMetaTags()        │
                            │ + getOrGenerateCached()     │
                            │ + invalidateCache()         │
                            │ + scheduleRegeneration()    │
                            │ + getMetaTagsForPreview()   │
                            │ + getRegenerationJobStatus()│
                            └─────────────┬───────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ◇                     ◇                     ◇
        ┌───────────▼────────────┐ ┌───────▼────────────────────┐ ┌───────▼─────────────┐
        │ CL-C3.1 ContentAnalyzer│ │ CL-C2.5 Structured         │ │ CL-C2.6 MetaTagCache│
        ├────────────────────────┤ │ DataGenerator              │ ├─────────────────────┤
        │ - keywordExtractor     │ ├────────────────────────────┤ │ - cache: Redis      │
        │ - summarizer           │ │ + generateDiscussionForum()│ │ - ttl: number       │
        │ - topicClassifier      │ │ + generateBreadcrumbList() │ ├─────────────────────┤
        ├────────────────────────┤ │ + generateOrganization()   │ │ + get()             │
        │ + analyzeThread()      │ │ + generateWebPage()        │ │ + set()             │
        │ + getTopicCategory()   │ └────────────────────────────┘ │ + invalidate()      │
        │ + getSentiment()       │                                └─────────────────────┘
        │ + getReadingLevel()    │
        └───────────┬────────────┘
                    │
        ┌───────────┼───────────────────────────────────┐
        │                 │                             │
        ◆                 ◆                             ◆
┌───────▼─────────────┐ ┌─▼───────────────────────┐ ┌───▼───────────────┐
│ CL-C3.2 Keyword     │ │ CL-C3.3 Text            │ │ CL-C3.4 Topic     │
│ Extractor           │ │ Summarizer              │ │ Classifier        │
├─────────────────────┤ ├─────────────────────────┤ ├───────────────────┤
│ - stopWords         │ │ - maxSentences          │ │ - categories      │
├─────────────────────┤ ├─────────────────────────┤ ├───────────────────┤
│ + extractKeywords() │ │ + summarize()           │ │ + classify()      │
│ + extractPhrases()  │ │ + extractFirstSentence()│ │ + getTop()        │
│ + scoreByFrequency()│ │ + extractKeySentences() │ │ + getKeywords()   │
└─────────────────────┘ └─────────────────────────┘ └───────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Data Transfer Objects                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│ CL-D1 MetaTagSet        │     │ CL-D2 OpenGraphTags     │
│ <<DTO>>                 │     │ <<DTO>>                 │
├─────────────────────────┤     ├─────────────────────────┤
│ + title: string         │     │ + ogTitle: string       │
│ + description: string   │     │ + ogDescription: string │
│ + canonical: string     │     │ + ogImage: string       │
│ + robots: string        │     │ + ogType: string        │
│ + openGraph: OGTags     │     │ + ogUrl: string         │
│ + twitter: TwitterTags  │     │ + ogSiteName: string    │
│ + structuredData: JSON  │     └─────────────────────────┘
│ + keywords: string[]    │
└─────────────────────────┘     ┌─────────────────────────┐
                                │ CL-D3 TwitterCardTags   │
┌─────────────────────────┐     │ <<DTO>>                 │
│ CL-D4 StructuredData    │     ├─────────────────────────┤
│ <<DTO>>                 │     │ + card: string          │
├─────────────────────────┤     │ + title: string         │
│ + @context: string      │     │ + description: string   │
│ + @type: string         │     │ + image: string         │
│ + headline: string      │     │ + site: string          │
│ + description: string   │     └─────────────────────────┘
│ + author: Person        │
│ + datePublished: string │     ┌─────────────────────────┐
│ + dateModified: string  │     │ CL-D5 ContentAnalysis   │
│ + mainEntity: object    │     │ <<DTO>>                 │
│ + breadcrumb: object    │     ├─────────────────────────┤
└─────────────────────────┘     │ + keywords: string[]    │
                                │ + topics: string[]      │
                                │ + summary: string       │
                                │ + sentiment: string     │
                                │ + readingLevel: string  │
                                └─────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Domain Entities                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐     ┌─────────────────────────┐
│ CL-E1 Channel           │     │ CL-E2 Message           │
│ <<Entity>>              │     │ <<Entity>>              │
├─────────────────────────┤     ├─────────────────────────┤
│ + id: UUID              │◄────│ + id: UUID              │
│ + serverId: UUID        │ 1 * │ + channelId: UUID       │
│ + name: string          │     │ + authorId: UUID        │
│ + slug: string          │     │ + content: string       │
│ + topic: string         │     │ + createdAt: DateTime   │
│ + visibility: Enum      │     │ + attachments: []       │
└─────────────────────────┘     └─────────────────────────┘

┌─────────────────────────┐
│ CL-E3 GeneratedMetaTags │
│ <<Entity>>              │
├─────────────────────────┤
│ + id: UUID              │
│ + channelId: UUID       │
│ + title: string         │
│ + description: string   │
│ + ogTitle: string       │
│ + ogDescription: string │
│ + ogImage: string       │
│ + keywords: string[]    │
│ + structuredData: JSON  │
│ + generatedAt: DateTime │
│ + contentHash: string   │
│ + version: number       │
└─────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                          Page Rendering (M1)                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐      uses      ┌──────────────────────────────┐
│ CL-C1.1 PublicChannelPage    │───────────────►│ CL-C2.1 MetaTagService       │
├──────────────────────────────┤                └──────────────────────────────┘
│ - serverSlug: string         │
│ - channelSlug: string        │
│ - messages: Message[]        │
│ - metaTags: MetaTagSet       │
├──────────────────────────────┤
│ + getServerSideProps()       │
│ + render()                   │
└───────────────┬──────────────┘
                │
                │ ◆
                ▼
       ┌──────────────────────────────┐
       │ CL-C1.2 HeadComponent        │
       ├──────────────────────────────┤
       │ - meta: MetaTagSet           │
       ├──────────────────────────────┤
       │ + renderMetaTags()           │
       │ + renderOpenGraph()          │
       │ + renderTwitterCards()       │
       │ + renderStructuredData()     │
       │ + renderCanonical()          │
       └──────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                    Background Processing + Data Access (M4/M5)                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐    triggers    ┌──────────────────────────────┐
│ CL-C4.2 EventListener        │───────────────►│ CL-C4.1 MetaTagUpdateWorker  │
├──────────────────────────────┤                ├──────────────────────────────┤
│ - eventBus: EventBus         │                │ - queue: JobQueue            │
├──────────────────────────────┤                │ - metaTagService: ref        │
│ + onMessageCreated()         │                ├──────────────────────────────┤
│ + onMessageEdited()          │                │ + processJob()               │
│ + onMessageDeleted()         │                │ + scheduleUpdate()           │
│ + onVisibilityChanged()      │                │ + batchProcess()             │
└───────────────┬──────────────┘                └───────────────┬──────────────┘
                │                                                │
                │ uses                                           │ uses
                ▼                                                ▼
      ┌──────────────────────────────┐               ┌──────────────────────────────┐
      │ CL-C4.3 SitemapUpdater       │               │ CL-C2.1 MetaTagService       │
      ├──────────────────────────────┤               └───────────────┬──────────────┘
      │ - searchClients: ref         │                               │
      ├──────────────────────────────┤                               │
      │ + updateLastModified()       │                               │
      │ + notifySearchEngines()      │                               │
      │ + requestDeindex()           │                               │
      └──────────────────────────────┘                               │
                                 ┌───────────────────────────────────┼────────────────────────────────────┐
                                 ▼                                   ▼                                    ▼
            ┌─────────────────────────────────┐     ┌──────────────────────────────┐     ┌──────────────────────────────┐
            │ CL-C5.1 ChannelRepository       │     │ CL-C5.2 MessageRepository    │     │ CL-C5.3 MetaTagRepository    │
            ├─────────────────────────────────┤     ├──────────────────────────────┤     ├──────────────────────────────┤
            │ - database: DatabaseClient      │     │ - database: DatabaseClient   │     │ - database: DatabaseClient   │
            ├─────────────────────────────────┤     ├──────────────────────────────┤     ├──────────────────────────────┤
            │ + findById(), findBySlug()      │     │ + findRecentByChannel()      │     │ + findByChannelId()          │
            │ + update()                      │     │ + findFirstMessage()         │     │ + upsert()                   │
            │ + findPublicByServerId()        │     │ + getMessageCount()          │     │ + getLastGenerated()         │
            │ + getVisibility(), getMetadata()│     │                              │     │                              │
            └─────────────────────────────────┘     └──────────────────────────────┘     └──────────────────────────────┘
```

### 3.1 Rationale
This gave us a great insight into how the class structure for the rest of the specification would turn out. The LLM did a good job keeping everything decoupled and modular. We had to reprompt to ensure that classes and methods were aligned with rest of specification.

---

## 4. List of Classes

Class labels in this section intentionally match Section 3 (`CL-I`, `CL-C`, `CL-D`, `CL-E`) to keep diagram and inventory references consistent.

### 4.1 Page Rendering Module (M1)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C1.1 | PublicChannelPage | Page Component | Next.js page that fetches meta tags and renders the public channel view |
| CL-C1.2 | HeadComponent | UI Component | Renders all meta tags in the HTML <head> section |

### 4.2 Meta Tag Generation Module (M2)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C2.1 | MetaTagService | Service (Facade) | Orchestrates meta tag generation, caching, and invalidation |
| CL-C2.2 | TitleGenerator | Service | Generates SEO-optimized page titles from channel/message content |
| CL-C2.3 | DescriptionGenerator | Service | Generates meta descriptions from thread summaries |
| CL-C2.4 | OpenGraphGenerator | Service | Generates Open Graph and Twitter Card meta tags |
| CL-C2.5 | StructuredDataGenerator | Service | Generates JSON-LD structured data for rich snippets |
| CL-C2.6 | MetaTagCache | Service | Caches generated meta tags in Redis |

### 4.3 Content Analysis Module (M3)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C3.1 | ContentAnalyzer | Service | Coordinates content analysis for meta tag generation |
| CL-C3.2 | KeywordExtractor | Service | Extracts relevant keywords from message content |
| CL-C3.3 | TextSummarizer | Service | Summarizes thread content for descriptions |
| CL-C3.4 | TopicClassifier | Service | Classifies channel content into topic categories |

### 4.4 Background Processing Module (M4)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C4.1 | MetaTagUpdateWorker | Worker | Processes queued meta tag regeneration jobs |
| CL-C4.2 | EventListener | Service | Listens to message + visibility events and schedules meta tag updates |
| CL-C4.3 | SitemapUpdater | Service | Updates sitemap lastmod and pings search engines |

### 4.5 Data Access Module (M5)

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-C5.1 | ChannelRepository | Repository | Data access for channel entities |
| CL-C5.2 | MessageRepository | Repository | Data access for messages with content retrieval |
| CL-C5.3 | MetaTagRepository | Repository | Data access for persisted meta tags |

### 4.6 Data Transfer Objects

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-D1 | MetaTagSet | DTO | Complete set of meta tags for a page |
| CL-D2 | OpenGraphTags | DTO | Open Graph protocol tags |
| CL-D3 | TwitterCardTags | DTO | Twitter Card tags |
| CL-D4 | StructuredData | DTO | JSON-LD structured data |
| CL-D5 | ContentAnalysis | DTO | Results of content analysis |

### 4.7 Domain Entities

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-E1 | Channel | Entity | Channel domain entity |
| CL-E2 | Message | Entity | Message domain entity |
| CL-E3 | GeneratedMetaTags | Entity | Persisted generated meta tags |

### 4.8 Shared Interfaces

| Label | Class Name | Type | Purpose |
|-------|------------|------|---------|
| CL-I1 | IMetaTagGenerator | Interface | Shared `generate()` / `validate()` contract for meta tag generator classes |

### 4.9 Rationale
This lists all of the classes created and used for this spec. Everything is modularized well and we only needed reprompting to ensure that this was consistent with the other sections.

---

## 5. State Diagrams

### 5.1 System State Variables

| Variable | Type | Description |
|----------|------|-------------|
| channel.id | UUID | Channel being processed |
| metaTags.status | MetaTagStatus | Current generation status |
| metaTags.version | number | Version of generated tags |
| cache.hit | boolean | Whether tags were served from cache |
| content.hash | string | Hash of content used for generation |

### 5.2 Meta Tag Generation State Machine

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  (( ))  Initial State        [ ]  State         < >  Decision                   │
│  ─────► Transition           [[ ]] Final State                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                    (( S0: Page Requested ))
                              │
                              │ GET /c/{server}/{channel}
                              ▼
              ┌───────────────────────────────┐
              │ S1: Check Cache               │
              │ ──────────────────────────────│
              │ cache.checking = true         │
              │ channelId = resolved          │
              └───────────────┬───────────────┘
                              │
                      < Cache Hit? >
                     /              \
                    / Yes            \ No
                   ▼                  ▼
    ┌──────────────────────┐   ┌───────────────────────────────┐
    │ S2: Serve Cached     │   │ S3: Check Database            │
    │ ──────────────────── │   │ ───────────────────────────── │
    │ cache.hit = true     │   │ db.checking = true            │
    │ metaTags = cached    │   └───────────────┬───────────────┘
    └──────────┬───────────┘                   │
               │                       < DB Record Exists? >
               │                      /                     \
               │                     / Yes                   \ No
               │                    ▼                         ▼
               │    ┌──────────────────────┐   ┌───────────────────────────────┐
               │    │ S4: Check Freshness  │   │ S5: Generate New              │
               │    │ ──────────────────── │   │ ───────────────────────────── │
               │    │ contentHash = calc   │   │ status = GENERATING           │
               │    └──────────┬───────────┘   │ analyzer.running = true       │
               │               │               └───────────────┬───────────────┘
               │       < Hash Match? >                         │
               │      /              \                         │
               │     / Yes            \ No                     │
               │    ▼                  ▼                       │
               │ ┌────────────┐  ┌─────────────┐               │
               │ │S6: Use DB  │  │S7: Regenerate│              │
               │ │Tags        │  │Tags         │◄──────────────┘
               │ │            │  │             │
               │ │metaTags =  │  │queueJob()   │
               │ │  dbRecord  │  │             │
               │ └─────┬──────┘  └──────┬──────┘
               │       │                │
               │       │        ┌───────┴───────────────────┐
               │       │        │ Sync                      │ Async (background)
               │       │        ▼                           ▼
               │       │   ┌─────────────┐           ┌─────────────┐
               │       │   │ S8: Analyze │           │ S9: Use     │
               │       │   │ Content     │           │ Fallback    │
               │       │   │             │           │ (stale tags)│
               │       │   │ keywords =  │           └──────┬──────┘
               │       │   │   extracted │                  │
               │       │   │ summary =   │                  │
               │       │   │   generated │                  │
               │       │   └──────┬──────┘                  │
               │       │          │                         │
               │       │          ▼                         │
               │       │   ┌─────────────────┐              │
               │       │   │ S10: Generate   │              │
               │       │   │ All Tags        │              │
               │       │   │                 │              │
               │       │   │ title = gen     │              │
               │       │   │ desc = gen      │              │
               │       │   │ og = gen        │              │
               │       │   │ structured = gen│              │
               │       │   └──────┬──────────┘              │
               │       │          │                         │
               │       │          ▼                         │
               │       │   ┌─────────────────┐              │
               │       │   │ S11: Persist &  │              │
               │       │   │ Cache           │              │
               │       │   │                 │              │
               │       │   │ db.upsert()     │              │
               │       │   │ cache.set()     │              │
               │       │   └──────┬──────────┘              │
               │       │          │                         │
               └───────┴──────────┴─────────────────────────┘
                                  │
                                  ▼
              ┌───────────────────────────────┐
              │ S12: Render Page with Tags    │
              │ ───────────────────────────── │
              │ <head> includes all meta tags │
              │ JSON-LD in <script>           │
              └───────────────┬───────────────┘
                              │
                              ▼
              [[ S13: Page Delivered ]]


State Transition Table:
┌────────────────────┬──────────────────────────┬────────────────────┬─────────────────────────────┐
│ Current State      │ Condition/Action         │ Next State         │ Side Effects                │
├────────────────────┼──────────────────────────┼────────────────────┼─────────────────────────────┤
│ S1: Check Cache    │ cache.get() returns data │ S2: Serve Cached   │ None                        │
│ S1: Check Cache    │ cache.get() returns null │ S3: Check Database │ Database query              │
│ S3: Check Database │ Record exists            │ S4: Check Freshness│ Calculate content hash      │
│ S3: Check Database │ No record                │ S5: Generate New   │ Start analysis              │
│ S4: Check Freshness│ Hash matches             │ S6: Use DB Tags    │ Update cache                │
│ S4: Check Freshness│ Hash differs             │ S7: Regenerate     │ Queue background job        │
│ S7: Regenerate     │ Sync regeneration        │ S8: Analyze        │ Fetch messages              │
│ S7: Regenerate     │ Async (background)       │ S9: Use Fallback   │ Serve stale, update later   │
│ S8: Analyze        │ Analysis complete        │ S10: Generate Tags │ Keywords, summary ready     │
│ S10: Generate Tags │ All tags generated       │ S11: Persist       │ Validation                  │
│ S11: Persist       │ Saved successfully       │ S12: Render        │ Cache invalidation          │
│ S2, S6, S9, S12    │ Tags ready               │ S13: Delivered     │ Response sent               │
└────────────────────┴──────────────────────────┴────────────────────┴─────────────────────────────┘
```

### 5.3 Background Update State Machine

```
                    (( B0: Event Received ))
                    MESSAGE_CREATED / MESSAGE_EDITED / MESSAGE_DELETED / VISIBILITY_CHANGED
                              │
                              ▼
              ┌───────────────────────────────┐
              │ B1: Debounce Check            │
              │ ─────────────────────────────│
              │ Check if job already queued   │
              │ for this channel              │
              └───────────────┬───────────────┘
                              │
                      < Job Exists? >
                     /              \
                    / Yes            \ No
                   ▼                  ▼
    ┌──────────────────────┐   ┌───────────────────────────────┐
    │ B2: Extend Delay     │   │ B3: Queue New Job             │
    │ ──────────────────── │   │ ───────────────────────────── │
    │ Reset debounce timer │   │ delay = 60 seconds            │
    │ to 60 seconds        │   │ priority = normal             │
    └──────────────────────┘   └───────────────┬───────────────┘
                                               │
                                               │ After delay expires
                                               ▼
                               ┌───────────────────────────────┐
                               │ B4: Worker Picks Up Job       │
                               │ ───────────────────────────── │
                               │ Lock acquired                 │
                               └───────────────┬───────────────┘
                                               │
                                    < VISIBILITY_CHANGED event? >
                                   /                              \
                                  / Yes                            \ No (content event)
                                 ▼                                  ▼
                    < newVisibility? >                    ┌──────────────────────────────┐
                   /        |         \                   │ B5: Fetch Latest Content     │
                  /         |          \                  │ ──────────────────────────── │
        PRIVATE  /  NO_INDEX|  INDEXABLE\                 │ Get last 100 messages        │
                ▼           ▼            ▼                │ Calculate content hash       │
 ┌──────────────────────────┐ ┌──────────────────────────┐└───────────────┬──────────────┘
 │ B12: De-index / Purge    │ │ B16: Regen (no-index)    │                │
 │ ──────────────────────── │ │ ──────────────────────── │        < Hash Changed? >
 │ Invalidate meta cache    │ │ Regen with robots=       │       /                \
 │ Purge CDN URL            │ │   noindex                │      / No               \ Yes
 │ Remove URL from sitemap  │ │ Exclude from indexable   │     ▼                    ▼
 │ Request search-engine    │ │   sitemap set            │ ┌──────────────────────┐ │
 │   removal                │ │ Invalidate meta cache    │ │ B6: Skip Update      │ │
 │ Release lock             │ └────────────┬─────────────┘ │ ──────────────────── │ │
 └────────────┬─────────────┘              │               │ Content unchanged    │ │
              │               ┌──────────────────────────┐ │ Release lock         │ │
              ▼               │ B17: Regen (indexable)   │ └──────────────────────┘ │
 [[ B13: De-index             │ ──────────────────────── │                          │
    Complete ]]               │ High-priority regen      │                          │
                              │ Keep URL in sitemap      │                          │
                              │ Refresh lastmod          │                          │
                              │ Invalidate meta cache    │                          │
                              └────────────┬─────────────┘                          │
                                           │                                        │
                                           └──────────────┬─────────────────────────┘
                                                          │
                                                          ▼
                                           ┌──────────────────────────────┐
                                           │ B7: Regenerate Tags          │
                                           │ ──────────────────────────── │
                                           │ Run full generation pipeline │
                                           └──────────────┬───────────────┘
                                                          │
                                                   ┌──────┴──────────────┐
                                                   │                     │ Timeout (>30s)
                                                   ▼                     ▼
                                    ┌──────────────────────────┐  ┌──────────────────────┐
                                    │ B8: Update Database      │  │ B14: Failed          │
                                    │ ──────────────────────── │  │ ──────────────────── │
                                    │ Upsert new tags          │  │ Keep last known tags │
                                    │ Increment version        │  │ needs_regeneration   │
                                    └────────────┬─────────────┘  │   = true             │
                                                 │                │ Retry up to max      │
                                      ┌──────────┴──────────┐     └──────────────────────┘
                                      │                     │ Upsert failure        ▲
                                      ▼                     └──────────────────────►│
                                      │
                                      ▼
                                    ┌──────────────────────────────┐
                                    │ B9: Invalidate Caches        │
                                    │ ──────────────────────────── │
                                    │ Redis cache invalidate       │
                                    │ CDN purge for URL            │
                                    └──────────────┬───────────────┘
                                                │
                                                ▼
                                ┌───────────────────────────────┐
                                │ B10: Notify Search Engines    │
                                │ ───────────────────────────── │
                                │ Update sitemap lastmod        │
                                │ Ping Google/Bing              │
                                └───────────────┬───────────────┘
                                         ┌──────┴──────────────┐
                                         │ Success             │ CDN/ping failure
                                         ▼                     ▼
                                         │  ┌───────────────────────────────┐
                                         │  │ B15: Partial Success          │
                                         │  │ ───────────────────────────── │
                                         │  │ Tags updated in DB/cache      │
                                         │  │ Retry external notifications  │
                                         │  │   asynchronously              │
                                         │  └───────────────────────────────┘
                                         ▼
                [[ B11: Update Complete ]]


State Transition Table:

┌────────────────────────┬──────────────────────────────────┬─────────────────────────┬───────────────────────────────────┐
│ Current State          │ Condition/Action                 │ Next State              │ Side Effects                      │
├────────────────────────┼──────────────────────────────────┼─────────────────────────┼───────────────────────────────────┤
│ B0: Event Received     │ Event arrives                    │ B1: Debounce Check      │ Parse event type                  │
│ B1: Debounce Check     │ Job already queued               │ B2: Extend Delay        │ Reset timer                       │
│ B1: Debounce Check     │ No existing job                  │ B3: Queue New Job       │ Create job with 60s delay         │
│ B3: Queue New Job      │ Delay expires                    │ B4: Worker Picks Up     │ Acquire lock                      │
│ B4: Worker Picks Up    │ VISIBILITY_CHANGED → PRIVATE     │ B12: De-index/Purge     │ Begin de-index flow               │
│ B4: Worker Picks Up    │ VISIBILITY_CHANGED → NO_INDEX    │ B16: Regen (no-index)   │ Regen with noindex, exclude from  │
│                        │                                  │                         │ indexable sitemap set             │
│ B4: Worker Picks Up    │ VISIBILITY_CHANGED → INDEXABLE   │ B17: Regen (indexable)  │ High-pri regen, keep URL in       │
│                        │                                  │                         │ sitemap, refresh lastmod          │
│ B4: Worker Picks Up    │ Content event (message ops)      │ B5: Fetch Content       │ Fetch messages, calc hash         │
│ B5: Fetch Content      │ Hash unchanged                   │ B6: Skip Update         │ Release lock                      │
│ B5: Fetch Content      │ Hash changed                     │ B7: Regenerate Tags     │ Run generation pipeline           │
│ B16: Regen (no-index)  │ Cache invalidated                │ B7: Regenerate Tags     │ Invalidate meta cache, regen with │
│                        │                                  │                         │ robots=noindex                    │
│ B17: Regen (indexable) │ Cache invalidated                │ B7: Regenerate Tags     │ Invalidate meta cache, high-pri   │
│                        │                                  │                         │ regen, refresh sitemap lastmod    │
│ B7: Regenerate Tags    │ Generation succeeds              │ B8: Update Database     │ Upsert tags, increment version    │
│ B7: Regenerate Tags    │ Worker timeout (>30s)            │ B14: Failed             │ Keep last tags, emit metric       │
│ B8: Update Database    │ Upsert succeeds                  │ B9: Invalidate Caches   │ Redis invalidate, CDN purge       │
│ B8: Update Database    │ Upsert failure                   │ B14: Failed             │ Skip cache write, retry/alert     │
│ B9: Invalidate Caches  │ Invalidation succeeds            │ B10: Notify Engines     │ Update sitemap, ping crawlers     │
│ B9: Invalidate Caches  │ CDN purge failure                │ B15: Partial Success    │ Retry CDN purge asynchronously    │
│ B10: Notify Engines    │ Notification succeeds            │ B11: Update Complete    │ Done                              │
│ B10: Notify Engines    │ Search ping failure              │ B15: Partial Success    │ Retry notifications async         │
│ B12: De-index/Purge    │ Purge + removal complete         │ B13: De-index Complete  │ Sitemap + CDN + cache cleared,    │
│                        │                                  │                         │ release lock                      │
└────────────────────────┴──────────────────────────────────┴─────────────────────────┴───────────────────────────────────┘
```

**Additional Event Semantics (de-index + failure paths):**

| Trigger | Transition | Side Effects | Failure Handling |
|---------|------------|--------------|------------------|
| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_INDEXABLE` | `B0 → B3 (Queue) → B17 (Regen indexable) → B7 → B11 (Complete)` | Queue high-priority regeneration, invalidate `meta:channel:{channelId}`, keep canonical URL in sitemap with refreshed `lastmod` | Retry queue enqueue with backoff; keep last known tags until regeneration succeeds |
| `VISIBILITY_CHANGED` where `newVisibility = PUBLIC_NO_INDEX` | `B0 → B3 (Queue) → B16 (Regen no-index) → B7 → B11 (Complete)` | Regenerate tags with `robots=noindex`, invalidate `meta:channel:{channelId}`, keep channel public but excluded from indexable sitemap set | Retry queue enqueue with backoff; continue serving public tags with noindex policy |
| `VISIBILITY_CHANGED` where `newVisibility = PRIVATE` | `B0 → B12 (De-index/Purge) → B13 (Complete)` | Invalidate `meta:channel:{channelId}`, purge CDN URL, remove channel URL from sitemap, request search-engine recrawl/removal | Retry queue with exponential backoff; preserve stale tags in DB but never serve while channel is private |
| Worker timeout (>30s) | `B7 → B14 (Failed)` | Keep last successful tags active, emit failure metric | Mark job `failed`, set `needs_regeneration=true`, retry up to max attempts |
| DB upsert failure | `B8 → B14 (Failed)` | Skip cache write to avoid cache/DB drift | Retry with backoff and alert after final failure |
| CDN/Search ping failure | `B9/B10 → B15 (Partial Success)` | Meta tags remain updated in DB/cache | Continue serving updated tags and retry external notifications asynchronously |

### 5.4 Rationale
This shows the key part of the full state of the meta tag generation from what happens on the device and what happens in the background asynchronously to get the tags. We prompted for an updated diagrams as some states were missing for the different visbilities in the background process and we also had to add more scenarios such as timeouts and failures. 

---

## 6. Flow Charts

### 6.1 Scenario: Search Engine Crawls Page and Reads Meta Tags

**Scenario Description:** A search engine bot crawls a public channel page. The system generates and serves appropriate meta tags that describe the channel content, enabling rich search result previews.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  (( ))   Start/End (Terminal)        [ ]  Process        < >  Decision          │
│  /   /   Input/Output                [===]  Predefined Process (Subroutine)     │
└─────────────────────────────────────────────────────────────────────────────────┘

    (( START: Googlebot requests public channel ))
    GET /c/gamedev/unity-physics-help
    User-Agent: Googlebot/2.1
                            │
                            │ [State: S0]
                            ▼
            ┌───────────────────────────────┐
            │ [F1.1] Resolve channel        │
            │ Server.ChannelRepository.     │
            │   findBySlug("gamedev",       │
            │     "unity-physics-help")     │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F1.2] Verify channel is      │
            │ PUBLIC_INDEXABLE              │
            │ Server.VisibilityGuard.       │
            │   isChannelPublic()           │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F1.3] Check meta tag cache   │  [State: S1]
            │ Server.MetaTagCache.get(      │
            │   channelId)                  │
            └───────────────┬───────────────┘
                            │
                    < F1.4: Cache hit? >
                   /                    \
                  / Yes                  \ No
                 ▼                        ▼
    ┌─────────────────────────┐    ┌───────────────────────────────┐
    │ [F1.5] Use cached tags  │    │ [F1.6] Check database for     │  [State: S3]
    │ [State: S2]             │    │ persisted tags                │
    │                         │    │ Server.MetaTagRepository.     │
    │                         │    │   findByChannelId()           │
    └───────────┬─────────────┘    └───────────────┬───────────────┘
                │                                  │
                │                          < F1.7: DB record exists? >
                │                         /                          \
                │                        / Yes                        \ No
                │                       ▼                              ▼
                │       ┌───────────────────────────┐   ┌───────────────────────────────┐
                │       │ [F1.8] Calculate content  │   │ [F1.9] Generate tags from     │
                │       │ hash of recent messages   │   │ scratch                       │
                │       │ Server.MessageRepository. │   │ (First-time generation)       │
                │       │   getContentHash()        │   │ [State: S5]                   │
                │       └───────────────┬───────────┘   └───────────────┬───────────────┘
                │                       │                               │
                │               < F1.10: Hash matches? >                │
                │              /                        \               │
                │             / Yes                      \ No           │
                │            ▼                            ▼             │
                │  ┌─────────────────────┐  ┌─────────────────────────┐ │
                │  │ [F1.11] Use DB tags │  │ [F1.12] Regenerate tags │ │
                │  │ Update cache        │  │ Content has changed     │ │
                │  │ [State: S6]         │  │ [State: S7]             │ │
                │  └──────────┬──────────┘  └────────────┬────────────┘ │
                │             │                          │              │
                │             │              ┌───────────┴──────────────┘
                │             │              │
                │             │              ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.13] Fetch recent messages │
                │             │  │ Server.MessageRepository.     │
                │             │  │   findRecentByChannel(        │
                │             │  │     channelId, limit=100)     │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.14] Analyze content       │  [State: S8]
                │             │  │ Server.ContentAnalyzer.       │
                │             │  │   analyzeThread(messages)     │
                │             │  │                               │
                │             │  │ - Extract keywords            │
                │             │  │ - Classify topic              │
                │             │  │ - Summarize thread            │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.15] Generate title        │  [State: S10]
                │             │  │ Server.TitleGenerator.        │
                │             │  │   generateFromChannel()       │
                │             │  │                               │
                │             │  │ Template: "{Topic} - {Server}"│
                │             │  │ Example: "Unity Physics       │
                │             │  │   Troubleshooting - GameDev"  │
                │             │  │ Max 60 chars                  │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.16] Generate description  │
                │             │  │ Server.DescriptionGenerator.  │
                │             │  │   generateFromMessages()      │
                │             │  │                               │
                │             │  │ "Community discussion about   │
                │             │  │ Unity physics issues including│
                │             │  │ rigidbody collisions, gravity │
                │             │  │ settings, and performance..." │
                │             │  │ Max 160 chars                 │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.17] Generate Open Graph   │
                │             │  │ Server.OpenGraphGenerator.    │
                │             │  │   generateOGTags()            │
                │             │  │                               │
                │             │  │ og:title (max 95 chars)       │
                │             │  │ og:description (max 300 chars)│
                │             │  │ og:image (preview image)      │
                │             │  │ og:type = "website"           │
                │             │  │ og:url (canonical)            │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.18] Generate Twitter Card │
                │             │  │ Server.OpenGraphGenerator.    │
                │             │  │   generateTwitterCard()       │
                │             │  │                               │
                │             │  │ twitter:card = "summary" or    │
                │             │  │   "summary_large_image"        │
                │             │  │ twitter:title                 │
                │             │  │ twitter:description           │
                │             │  │ twitter:image                 │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌────────────────────────────────┐
                │             │  │ [F1.19] Generate JSON-LD       │
                │             │  │ Server.StructuredDataGen.      │
                │             │  │   generateDiscussionForum()    │
                │             │  │                                │
                │             │  │ @type: "DiscussionForumPosting"│
                │             │  │ headline, datePublished,       │
                │             │  │ author, interactionStatistic   │
                │             │  └───────────────┬────────────────┘
                │             │                  │
                │             │                  ▼
                │             │  ┌───────────────────────────────┐
                │             │  │ [F1.20] Persist and cache     │  [State: S11]
                │             │  │ Server.MetaTagRepository.     │
                │             │  │   upsert(channelId, metaTags) │
                │             │  │ Server.MetaTagCache.set()     │
                │             │  └───────────────┬───────────────┘
                │             │                  │
                └─────────────┴──────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ [F1.21] Render HTML <head>    │  [State: S12]
                    │ Server.HeadComponent.         │
                    │   renderMetaTags()            │
                    │   renderOpenGraph()           │
                    │   renderTwitterCards()        │
                    │   renderStructuredData()      │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    /────────────────────────────────────/
                    / HTML Response with <head>:         /
                    /                                    /
                    / <title>Unity Physics               /
                    /   Troubleshooting - GameDev        /
                    / </title>                           /
                    / <meta name="description"           /
                    /   content="Community disc"...      /
                    / <meta property="og:title"...       /
                    / <meta property="og:description"... /
                    / <meta name="twitter:card"...       /
                    / <script type="application/         /
                    /   ld+json">...</script>            /
                    /                                    /
                    /────────────────────────────────────/
                                    │
                                    ▼
                    (( END: Googlebot receives page ))  [State: S13]
                    - Title and description indexed
                    - Rich snippet data available
                    - Social sharing preview ready
```

### 6.2 Scenario: New Message Triggers Meta Tag Update

**Scenario Description:** A user posts a new message in a public channel. The system detects this event and schedules a background job to update the meta tags with fresh content.

```
    (( START: User posts message in public channel ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F2.1] Message saved to       │
            │ database                      │
            │ Server.MessageRepository.     │
            │   create(message)             │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F2.2] Event emitted          │
            │ Server.EventBus.emit(         │
            │   "MESSAGE_CREATED",          │
            │   { channelId, messageId })   │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F2.3] EventListener receives │
            │ Server.EventListener.         │
            │   onMessageCreated()          │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F2.4] Check if channel is    │
            │ public                        │
            │ Server.VisibilityGuard.       │
            │   isChannelPublic(channelId)  │
            └───────────────┬───────────────┘
                            │
                    < F2.5: Is public? >
                   /                    \
                  / No                   \ Yes
                 ▼                        ▼
    ┌─────────────────────────┐    ┌───────────────────────────────┐
    │ [F2.6] Ignore event     │    │ [F2.7] Check for existing     │  [State: B1]
    │ No meta tags needed     │    │ queued job                    │
    │ for private channel     │    │ Server.JobQueue.exists(       │
    └─────────────────────────┘    │   `meta-update:${channelId}`) │
                                   └───────────────┬───────────────┘
                                                   │
                                           < F2.8: Job exists? >
                                          /                      \
                                         / Yes                    \ No
                                        ▼                          ▼
                        ┌───────────────────────────┐  ┌───────────────────────────────┐
                        │ [F2.9] Extend delay       │  │ [F2.10] Queue new job         │  [State: B3]
                        │ Reset debounce to 60s     │  │ Server.JobQueue.add(          │
                        │ [State: B2]               │  │   `meta-update:${channelId}`, │
                        │                           │  │   { channelId },              │
                        │ (Prevents thrashing when  │  │   { delay: 60000 })           │
                        │  many messages posted)    │  │                               │
                        └───────────────────────────┘  └───────────────┬───────────────┘
                                                                       │
                                                                       │ 60 seconds later...
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F2.11] Worker picks up job   │  [State: B4]
                                                       │ Server.MetaTagUpdateWorker.   │
                                                       │   processJob()                │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F2.12] Calculate new content │  [State: B5]
                                                       │ hash                          │
                                                       │ Server.MessageRepository.     │
                                                       │   getContentHash(channelId)   │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                               < F2.13: Hash changed? >
                                                              /                        \
                                                             / No                       \ Yes
                                                            ▼                            ▼
                                            ┌───────────────────────────┐  ┌───────────────────────────────┐
                                            │ [F2.14] Skip update       │  │ [F2.15] Regenerate meta tags  │
                                            │ Content unchanged         │  │ (Full pipeline from F1.13)    │
                                            │ [State: B6]               │  │ [State: B7]                   │
                                            └───────────────────────────┘  └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F2.16] Update database       │  [State: B8]
                                                                           │ Server.MetaTagRepository.     │
                                                                           │   upsert(channelId, newTags)  │
                                                                           │ Increment version             │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F2.17] Invalidate caches     │  [State: B9]
                                                                           │ Server.MetaTagCache.          │
                                                                           │   invalidate(channelId)       │
                                                                           │ Server.CDN.purge(channelUrl)  │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F2.18] Update sitemap        │  [State: B10]
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   updateLastModified(url)     │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F2.19] Ping search engines   │
                                                                           │ (Async, non-blocking)         │
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   notifySearchEngines()       │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                            (( END: Meta tags updated ))  [State: B11]
                                                            - Fresh content reflected
                                                            - Next crawl sees new tags
                                                            - Search engines notified
```

### 6.3 Scenario: Social Media Link Preview Generation

**Scenario Description:** A user shares a public channel link on Twitter/Facebook. The social media platform's crawler fetches the page and extracts Open Graph tags to generate a rich link preview.

```
    (( START: User shares link on Twitter ))
    URL: https://harmony.app/c/opensource/announcements
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F3.1] Twitter card crawler   │
            │ requests URL                  │
            │ User-Agent: Twitterbot/1.0    │
            └───────────────┬───────────────┘
                            │
                            ▼
            (Same flow as F1.1 - F1.21)
            Meta tags served with emphasis on:
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F3.2] Twitter extracts       │
            │ Twitter Card tags:            │
            │                               │
            │ <meta name="twitter:card"     │
            │   content="summary_large_     │
            │   image">                     │
            │ <meta name="twitter:title"    │
            │   content="OpenSource         │
            │   Announcements">             │
            │ <meta name="twitter:desc..."  │
            │   content="Latest updates..." │
            │ <meta name="twitter:image"    │
            │   content="https://...">      │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F3.3] Twitter generates      │
            │ rich card preview:            │
            │                               │
            │ ┌─────────────────────────┐   │
            │ │ [Preview Image]         │   │
            │ │                         │   │
            │ │ OpenSource Announcements│   │
            │ │ Latest updates and news │   │
            │ │ from the community...   │   │
            │ │                         │   │
            │ │ harmony.app             │   │
            │ └─────────────────────────┘   │
            └───────────────────────────────┘
                            │
                            ▼
            (( END: Link preview displayed ))
            - Rich visual preview shown
            - Click-through rate improved
            - Brand visibility enhanced
```

### 6.4 Scenario: Content Creator Views SEO Preview

**Scenario Description:** A content creator/admin wants to see how their channel will appear in search results. The system provides a preview of the generated meta tags.

```
    (( START: Admin opens channel settings ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F4.1] Admin navigates to     │
            │ Channel Settings > SEO        │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F4.2] Fetch current meta     │
            │ tags for channel              │
            │ Client.API.getMetaTags(       │
            │   channelId)                  │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F4.3] Display SEO preview    │
            │                               │
            │ ┌─────────────────────────────┤
            │ │ Google Search Preview:      │
            │ │                             │
            │ │ Unity Physics Help - GameDev│
            │ │ https://harmony.app/c/game..│
            │ │ Community discussion about  │
            │ │ Unity physics issues...     │
            │ └─────────────────────────────┤
            │                               │
            │ ┌─────────────────────────────┤
            │ │ Social Media Preview:       │
            │ │                             │
            │ │ [Thumbnail Image]           │
            │ │ Unity Physics Help - GameDev│
            │ │ Community discussion...     │
            │ └─────────────────────────────┤
            │                               │
            │ Keywords: unity, physics,     │
            │   rigidbody, collision        │
            │                               │
            │ [Regenerate Tags] [Edit Tags] │
            └───────────────┬───────────────┘
                            │
                            ▼
            < F4.4: Admin clicks "Edit Tags"? >
           /                                  \
          / No                              Yes \
         ▼                                       ▼
    ┌─────────────┐              ┌────────────────────────────────┐
    │ [F4.5] Done │              │ [F4.6] Show custom override    │
    │             │              │ form                           │
    └─────────────┘              │                                │
                                 │ Custom Title: [____________]   │
                                 │ Custom Desc:  [____________]   │
                                 │ Preview Image: [Select...]     │
                                 │                                │
                                 │ Note: Custom tags override     │
                                 │ auto-generated content         │
                                 │                                │
                                 │ [Save] [Cancel] [Reset to Auto]│
                                 └────────────────────────────────┘
                                                │
                                                ▼
                                 (( END: Admin manages SEO ))
```

### 6.5 Scenario: Channel Visibility Changes to Private (De-Index and Purge)

**Scenario Description:** A channel transitions from `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX` to `PRIVATE`. Existing tags must stop being served and search engines must be notified to drop stale indexed content.

```
    (( START: Channel visibility changed to PRIVATE ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F5.1] EventListener receives │
            │ VISIBILITY_CHANGED event      │
            │ Server.EventListener.         │
            │   onVisibilityChanged()       │
            └───────────────┬───────────────┘
                            │
                            ▼
            < F5.2: New visibility is PRIVATE? >
           /                                    \
          / No                                Yes \
         ▼                                         ▼
    ┌─────────────────────────┐     ┌───────────────────────────────┐
    │ [F5.3] Handle non-      │     │ [F5.4] Invalidate cached      │
    │ private transition      │     │ meta tags                     │
    │ (e.g., PUBLIC_NO_INDEX  │     │ Server.MetaTagService.        │
    │  to PUBLIC_INDEXABLE;   │     │   invalidateCache(channelId)  │
    │  regenerate if needed)  │     │ Delete meta:channel:{id}      │
    └─────────────────────────┘     └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ [F5.5] Remove from sitemap    │
                                    │ Server.SitemapUpdater.        │
                                    │   removeUrl(channelUrl)       │
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ [F5.6] Queue search-engine    │
                                    │ removal notification          │
                                    │ Server.SitemapUpdater.        │
                                    │   notifyUrlRemoval(           │
                                    │     channelUrl)               │
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ [F5.7] Purge CDN cache        │
                                    │ Server.CDN.purge(channelUrl)  │
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                    ┌───────────────────────────────┐
                                    │ [F5.8] Retain DB records      │
                                    │ for rollback/audit            │
                                    │ generated_meta_tags rows kept │
                                    │ VisibilityGuard blocks        │
                                    │ serving while PRIVATE         │
                                    └───────────────┬───────────────┘
                                                    │
                                                    ▼
                                    < F5.9: Channel later restored  >
                                    < to PUBLIC_INDEXABLE or        >
                                    < PUBLIC_NO_INDEX?              >
                                   /                                \
                                  / No                            Yes \
                                 ▼                                     ▼
                    ┌─────────────────────┐         ┌───────────────────────────────┐
                    │ [F5.10] Tags remain │         │ [F5.11] Regeneration runs     │
                    │ blocked from        │         │ before tags are served again  │
                    │ serving             │         │ Server.MetaTagService.        │
                    └─────────────────────┘         │   generateMetaTags(channelId, │
                                                    │     { forceRegenerate: true })│
                                                    └───────────────┬───────────────┘
                                                                    │
                                                                    ▼
                                                    (( END: Channel de-indexed ))
                                                    - Cache cleared
                                                    - Sitemap updated
                                                    - Search engines notified
                                                    - Tags blocked until re-public
```

**Ownership Boundary:** De-indexing requests tied to visibility transitions are initiated here; the canonical visibility state remains owned by the channel visibility feature.

### 6.6 Scenario: User Deletes a Message in a Public Channel

**Scenario Description:** A user deletes a message in a public channel. The system detects the deletion event and schedules a background job to regenerate meta tags so that search engines no longer surface content from the deleted message.

```
    (( START: User deletes message in public channel ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F6.1] Message removed from   │
            │ database                      │
            │ Server.MessageRepository.     │
            │   delete(messageId)           │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F6.2] Event emitted          │
            │ Server.EventBus.emit(         │
            │   "MESSAGE_DELETED",          │
            │   { channelId, messageId })   │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F6.3] EventListener receives │
            │ Server.EventListener.         │
            │   onMessageDeleted()          │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F6.4] Check if channel is    │
            │ public                        │
            │ Server.VisibilityGuard.       │
            │   isChannelPublic(channelId)  │
            └───────────────┬───────────────┘
                            │
                    < F6.5: Is public? >
                   /                    \
                  / No                   \ Yes
                 ▼                        ▼
    ┌─────────────────────────┐    ┌───────────────────────────────┐
    │ [F6.6] Ignore event     │    │ [F6.7] Check for existing     │
    │ No meta tag update      │    │ queued job                    │
    │ needed for private      │    │ Server.JobQueue.exists(       │
    │ channel                 │    │   `meta-update:${channelId}`) │
    └─────────────────────────┘    └───────────────┬───────────────┘
                                                   │
                                           < F6.8: Job exists? >
                                          /                      \
                                         / Yes                    \ No
                                        ▼                          ▼
                        ┌───────────────────────────┐  ┌───────────────────────────────┐
                        │ [F6.9] Extend delay       │  │ [F6.10] Queue new job         │
                        │ Reset debounce to 60s     │  │ Server.JobQueue.add(          │
                        │                           │  │   `meta-update:${channelId}`, │
                        │ (Prevents thrashing when  │  │   { channelId },              │
                        │  multiple deletes occur)  │  │   { delay: 60000 })           │
                        └───────────────────────────┘  └───────────────┬───────────────┘
                                                                       │
                                                                       │ 60 seconds later...
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F6.11] Worker picks up job   │
                                                       │ Server.MetaTagUpdateWorker.   │
                                                       │   processJob()                │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F6.12] Calculate new content │
                                                       │ hash (without deleted message)│
                                                       │ Server.MessageRepository.     │
                                                       │   getContentHash(channelId)   │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                               < F6.13: Hash changed? >
                                                              /                        \
                                                             / No                       \ Yes
                                                            ▼                            ▼
                                            ┌───────────────────────────┐  ┌───────────────────────────────┐
                                            │ [F6.14] Skip update       │  │ [F6.15] Regenerate meta tags  │
                                            │ Content unchanged         │  │ (Full pipeline from F1.13)    │
                                            │ (deleted message was not  │  │ Ensures deleted content no    │
                                            │  reflected in tags)       │  │ longer appears in tags        │
                                            └───────────────────────────┘  └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F6.16] Update database       │
                                                                           │ Server.MetaTagRepository.     │
                                                                           │   upsert(channelId, newTags)  │
                                                                           │ Increment version             │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F6.17] Invalidate caches     │
                                                                           │ Server.MetaTagCache.          │
                                                                           │   invalidate(channelId)       │
                                                                           │ Server.CDN.purge(channelUrl)  │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F6.18] Update sitemap        │
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   updateLastModified(url)     │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F6.19] Ping search engines   │
                                                                           │ (Async, non-blocking)         │
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   notifySearchEngines()       │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                            (( END: Meta tags updated ))
                                                                            - Deleted content removed
                                                                            - Fresh tags regenerated
                                                                            - Search engines notified
```

### 6.7 Scenario: User Edits a Message in a Public Channel

**Scenario Description:** A user edits an existing message in a public channel. The updated content may change the keywords, title, or description that were derived from that message, so the system schedules a background regeneration job.

```
    (( START: User edits message in public channel ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F7.1] Message updated in     │
            │ database                      │
            │ Server.MessageRepository.     │
            │   update(messageId, content)  │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F7.2] Event emitted          │
            │ Server.EventBus.emit(         │
            │   "MESSAGE_UPDATED",          │
            │   { channelId, messageId })   │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F7.3] EventListener receives │
            │ Server.EventListener.         │
            │   onMessageUpdated()          │
            └───────────────┬───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F7.4] Check if channel is    │
            │ public                        │
            │ Server.VisibilityGuard.       │
            │   isChannelPublic(channelId)  │
            └───────────────┬───────────────┘
                            │
                    < F7.5: Is public? >
                   /                    \
                  / No                   \ Yes
                 ▼                        ▼
    ┌─────────────────────────┐    ┌───────────────────────────────┐
    │ [F7.6] Ignore event     │    │ [F7.7] Check for existing     │
    │ No meta tag update      │    │ queued job                    │
    │ needed for private      │    │ Server.JobQueue.exists(       │
    │ channel                 │    │   `meta-update:${channelId}`) │
    └─────────────────────────┘    └───────────────┬───────────────┘
                                                   │
                                           < F7.8: Job exists? >
                                          /                      \
                                         / Yes                    \ No
                                        ▼                          ▼
                        ┌───────────────────────────┐  ┌───────────────────────────────┐
                        │ [F7.9] Extend delay       │  │ [F7.10] Queue new job         │
                        │ Reset debounce to 60s     │  │ Server.JobQueue.add(          │
                        │                           │  │   `meta-update:${channelId}`, │
                        │ (Prevents thrashing when  │  │   { channelId },              │
                        │  rapid edits occur)       │  │   { delay: 60000 })           │
                        └───────────────────────────┘  └───────────────┬───────────────┘
                                                                       │
                                                                       │ 60 seconds later...
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F7.11] Worker picks up job   │
                                                       │ Server.MetaTagUpdateWorker.   │
                                                       │   processJob()                │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                                       ▼
                                                       ┌───────────────────────────────┐
                                                       │ [F7.12] Calculate new content │
                                                       │ hash (with edited message)    │
                                                       │ Server.MessageRepository.     │
                                                       │   getContentHash(channelId)   │
                                                       └───────────────┬───────────────┘
                                                                       │
                                                               < F7.13: Hash changed? >
                                                              /                        \
                                                             / No                       \ Yes
                                                            ▼                            ▼
                                            ┌───────────────────────────┐  ┌───────────────────────────────┐
                                            │ [F7.14] Skip update       │  │ [F7.15] Regenerate meta tags  │
                                            │ Content hash unchanged    │  │ (Full pipeline from F1.13)    │
                                            │ (edit did not affect      │  │ Ensures tags reflect updated  │
                                            │  tag-relevant content)    │  │ message content               │
                                            └───────────────────────────┘  └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F7.16] Update database       │
                                                                           │ Server.MetaTagRepository.     │
                                                                           │   upsert(channelId, newTags)  │
                                                                           │ Increment version             │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F7.17] Invalidate caches     │
                                                                           │ Server.MetaTagCache.          │
                                                                           │   invalidate(channelId)       │
                                                                           │ Server.CDN.purge(channelUrl)  │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F7.18] Update sitemap        │
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   updateLastModified(url)     │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                           ┌───────────────────────────────┐
                                                                           │ [F7.19] Ping search engines   │
                                                                           │ (Async, non-blocking)         │
                                                                           │ Server.SitemapUpdater.        │
                                                                           │   notifySearchEngines()       │
                                                                           └───────────────┬───────────────┘
                                                                                           │
                                                                                           ▼
                                                                            (( END: Meta tags updated ))
                                                                            - Edited content reflected
                                                                            - Fresh tags regenerated
                                                                            - Search engines notified
```

### 6.8 Scenario: Channel Visibility Changes to Public (Indexable or Non-Indexable)

**Scenario Description:** A channel transitions from `PRIVATE` to `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX`, or switches between the two public states. Meta tags must be generated (or re-served), the sitemap updated, and indexing directives set according to the target visibility.

```
    (( START: Channel visibility changed to a public state ))
                            │
                            ▼
            ┌───────────────────────────────┐
            │ [F8.1] EventListener receives │
            │ VISIBILITY_CHANGED event      │
            │ Server.EventListener.         │
            │   onVisibilityChanged()       │
            └───────────────┬───────────────┘
                            │
                            ▼
              < F8.2: Previous visibility was PRIVATE? >
             /                                          \
            / Yes                                     No \
           ▼                                              ▼
  ┌──────────────────────────────┐            ┌───────────────────────────────┐
  │ [F8.3] Check for existing    │            │ [F8.4] Switching between      │
  │ retained meta tag records    │            │ PUBLIC_INDEXABLE and          │
  │ Server.MetaTagRepository.    │            │ PUBLIC_NO_INDEX               │
  │   findByChannel(channelId)   │            └───────────────┬───────────────┘
  └───────────────┬──────────────┘                            │
                  │                                           ▼
                  ▼                            ┌──────────────────────────────┐
   < F8.5: Records exist? >                    │ [F8.6] Update robots meta    │
  /                        \                   │ tag directive only           │
 / No                    Yes \                 │                              │
▼                             ▼                │ PUBLIC_INDEXABLE →           │
┌──────────────────────┐  ┌──────────────────┐ │   "index, follow"            │
│ [F8.7] Generate      │  │ [F8.8] Force     │ │ PUBLIC_NO_INDEX →            │
│ fresh meta tags      │  │ regeneration of  │ │   "noindex, follow"          │
│ from scratch         │  │ stale retained   │ └───────────────┬──────────────┘
│                      │  │ records          │                 │
│ Server.MetaTagSvc.   │  │                  │                 │
│  .generateMetaTags(  │  │ Server.MetaTagSvc│                 │
│    channelId)        │  │  .generateMeta(  │                 │
│                      │  │   channelId,     │                 │
│                      │  │   {force: true}) │                 │
└──────────┬───────────┘  └────────┬─────────┘                 │
           │                       │                           │
           └───────────┬───────────┘                           │
                       │                                       │
                       ▼                                       │
       ┌───────────────────────────────┐                       │
       │ [F8.9] Save generated tags    │                       │
       │ Server.MetaTagRepository.     │                       │
       │   upsert(channelId, newTags)  │                       │
       └───────────────┬───────────────┘                       │
                       │                                       │
                       └───────────────────┬───────────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │ [F8.10] Warm caches           │
                           │ Server.MetaTagCache.          │
                           │   set(channelId, tags)        │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
                           < F8.11: New visibility is      >
                           < PUBLIC_INDEXABLE?              >
                          /                                 \
                         / Yes                            No \
                        ▼                                     ▼
        ┌───────────────────────────────┐  ┌───────────────────────────────┐
        │ [F8.12] Add to sitemap        │  │ [F8.13] Remove from sitemap   │
        │ Server.SitemapUpdater.        │  │ (or keep removed)             │
        │   addUrl(channelUrl)          │  │ PUBLIC_NO_INDEX channels      │
        │                               │  │ should not appear in sitemap  │
        └───────────────┬───────────────┘  └───────────────┬───────────────┘
                        │                                  │
                        └──────────────┬───────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │ [F8.14] Purge CDN to serve    │
                       │ fresh tags                    │
                       │ Server.CDN.purge(channelUrl)  │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │ [F8.15] Ping search engines   │
                       │ (Async, non-blocking)         │
                       │ Server.SitemapUpdater.        │
                       │   notifySearchEngines()       │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                        (( END: Channel now public ))
                        - Meta tags generated/refreshed
                        - Robots directive set
                        - Sitemap updated per visibility
                        - Caches warmed
                        - Search engines notified
```

**Ownership Boundary:** The canonical visibility state is owned by the channel visibility feature; this flow reacts to the emitted `VISIBILITY_CHANGED` event and manages the SEO/meta tag consequences only.

### 6.9 Rationale
After having the LLM review this section, it was determined that it was missing a critical section to show what would change when a channel is turned to private. The majority of the scenarios here were designed by the LLM, but we also asked the LLM to add edit and deleting messages to ensure that all flows are covered. We also had to add a scenario for when the visibility is changed to a public state. These all describe all the possible flows that this user story will go through.

---

## 7. Development Risks and Failures

### 7.1 Runtime Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| RF-1 | Meta tag generation timeout | Page renders without custom tags, uses fallbacks | Generation job killed | Use cached/stale tags; retry later | Medium | Low |
| RF-2 | Content analysis crash | Generic meta tags shown | NLP processing error | Fallback to channel name/topic | Low | Low |
| RF-3 | Cache corruption | Stale or incorrect tags | Cache-DB mismatch | Invalidate cache; regenerate | Low | Medium |
| RF-4 | Job queue backlog | Delayed tag updates | Worker overwhelmed | Scale workers; prioritize active channels | Medium | Low |
| RF-5 | Database write failure | Old tags persist | Upsert fails | Retry with backoff; alert | Low | Medium |
| RF-6 | Keyword extraction produces nonsense | Poor search relevance | Algorithm failure | Manual review trigger; fallback keywords | Low | Medium |

### 7.2 Connectivity Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| CF-1 | Search engine ping fails | Delayed indexing | Notification not received | Queue retry; manual submission | Medium | Low |
| CF-2 | CDN cache purge fails | Stale tags served | Cache not invalidated | Retry purge; wait for TTL | Low | Medium |
| CF-3 | Database connection loss | Service degradation | Queries fail | Connection pool retry; failover | Low | High |

### 7.3 Content Quality Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| QF-1 | Title too generic | Poor click-through rate | Template fallback used | Improve generation algorithm | Medium | Medium |
| QF-2 | Description truncated poorly | Awkward preview text | Mid-word truncation | Sentence-aware truncation | Low | Low |
| QF-3 | Inappropriate content in tags | Embarrassing search results | Profanity/spam in source | Content filter before generation | Low | High |
| QF-4 | Duplicate titles across channels | SEO cannibalization | Same template output | Add unique identifiers | Medium | Medium |
| QF-5 | Keywords irrelevant | Wrong search audience | Topic classification error | Human review for high-traffic | Low | Medium |

### 7.4 Security/Privacy Failures

| Label | Failure Mode | User-Visible Effect | Internal Effect | Recovery Procedure | Likelihood | Impact |
|-------|--------------|--------------------|-----------------|--------------------|------------|--------|
| SF-1 | Private content in public tags | Privacy breach | Content leak in meta tags | Filter private mentions; audit | Low | Critical |
| SF-2 | User PII in description | GDPR/privacy violation | Name/email in summary | PII detection before generation | Low | Critical |
| SF-3 | XSS via meta tag content | Security vulnerability | Unsanitized user content | HTML entity encoding | Low | High |

### 7.5 Failure Priority Matrix

```
                    Impact
                    Low         Medium      High        Critical
            ┌───────────────────────────────────────────────────┐
     High   │           │               │           │           │
            ├───────────┼───────────────┼───────────┼───────────┤
   Medium   │ RF-1,RF-4 │ QF-1,QF-4     │           │           │
            │ CF-1      │               │           │           │
            ├───────────┼───────────────┼───────────┼───────────┤
     Low    │ RF-2,QF-2 │ RF-3,RF-5,RF-6│ CF-3,SF-3 │ SF-1,SF-2 │
            │           │ CF-2,QF-5     │ QF-3      │           │
            └───────────────────────────────────────────────────┘
```

### 7.6 Quality Monitoring and Alerts

| Metric | Source | Alert Threshold | Action |
|--------|--------|-----------------|--------|
| Duplicate title rate | `generated_meta_tags.title` aggregate query | >10% duplicate titles in 24h | Trigger quality review and template tuning |
| Average generated title length | Generated records where `custom_title IS NULL` | <30 chars for 24h | Investigate fallback overuse |
| Fallback generation rate | `needs_regeneration=true` count | >20% in 1h | Check NLP dependencies and worker health |
| PII filter match count | Content filter logs | Any non-test hit | Immediate security alert and rollback flag |
| Regeneration job failure rate | Job status telemetry | >5% failed jobs in 30m | Scale workers, inspect queue/backoff errors |

### 7.7 Rationale
This section goes over the risks that this feature may have and goes into detail about what can cause it and how it would impact the service. This only needed reprompting to add a section for how we can monitor the content to ensure that we can mitigate these risks quickly.

---

## 8. Technology Stack

| Label | Technology | Version | Purpose | Rationale | Source/Documentation |
|-------|------------|---------|---------|-----------|---------------------|
| T1 | TypeScript | 5.3+ | Primary language | Type safety | https://www.typescriptlang.org/ |
| T2 | React | 18.2+ | UI framework | Head component | https://react.dev/ |
| T3 | Next.js | 14.0+ | SSR framework | Meta tag injection in <head> | https://nextjs.org/ |
| T4 | Node.js | 20 LTS | Server runtime | Background workers | https://nodejs.org/ |
| T5 | PostgreSQL | 16+ | Primary database | Store generated tags | https://www.postgresql.org/ |
| T6 | Redis | 7.2+ | Caching | Fast meta tag retrieval | https://redis.io/ |
| T7 | BullMQ | 5.0+ | Job queue | Background processing | https://docs.bullmq.io/ |
| T8 | natural | 6.0+ | NLP library | Keyword extraction, summarization | https://github.com/NaturalNode/natural |
| T9 | compromise | 14.0+ | NLP library | Text parsing, sentence extraction | https://compromise.cool/ |
| T10 | schema-dts | 1.1+ | Structured data types | Type-safe JSON-LD | https://github.com/google/schema-dts |
| T11 | sanitize-html | 2.12+ | HTML sanitization | Prevent XSS in tags (Node.js-native) | https://github.com/apostrophecms/sanitize-html |
| T12 | Cloudflare | N/A | CDN | Cache invalidation API | https://www.cloudflare.com/ |
| T13 | Google Search Console API | v1 | Indexing | URL submission, sitemap ping | https://developers.google.com/webmaster-tools |
| T14 | Jest | 29+ | Testing | Unit tests for generators | https://jestjs.io/ |
| T15 | Prisma | 5.8+ | ORM | Shared type-safe database access across specs | https://www.prisma.io/ |
| T16 | Redis Pub/Sub | 7.2+ | EventBus transport | Cross-spec `VISIBILITY_CHANGED` and message event delivery | https://redis.io/docs/interact/pubsub/ |
| T17 | Bing Webmaster API | v1 | Indexing | URL submission/removal parity with Google | https://www.bing.com/webmasters |

> **Convention:** Authenticated internal APIs may be exposed through a tRPC gateway, while crawler-facing/public and admin integrations in this spec remain REST/HTTP.

### 8.1 EventBus

**Technology:** Redis Pub/Sub (T16)

Event types produced/consumed by this spec:

| Event | Direction | Source Spec | Description |
|-------|-----------|-------------|-------------|
| `VISIBILITY_CHANGED` | Consumed | Channel Visibility Toggle | Channel visibility state changed; trigger meta tag generation or purge |
| `MESSAGE_CREATED` | Produced | SEO Meta Tag Generation (this spec) | New message in a public channel |
| `MESSAGE_EDITED` | Produced | SEO Meta Tag Generation (this spec) | Message edited in a public channel |
| `MESSAGE_DELETED` | Produced | SEO Meta Tag Generation (this spec) | Message deleted from a public channel |
| `META_TAGS_UPDATED` | Produced | SEO Meta Tag Generation (this spec) | Meta tags regenerated for a channel |

### 8.2 Rationale
The LLM chose this stack and it makes sense for this type of application. Our primary language of choice is Typescript for its type safety and we will store all of our data in a PostgresSQL database with a Redis caching layer. We did have to reprompt to get the EventBus section so that this was aligned with the other specs.

---

## 9. APIs

### 9.1 Module M2: Meta Tag Generation

#### 9.1.1 CL-C2.1 MetaTagService

**Public Methods:**

```typescript
// Generate complete meta tag set for a channel
generateMetaTags(
  channelId: string,
  options?: {
    forceRegenerate?: boolean,
    includeStructuredData?: boolean
  }
): Promise<MetaTagSet>

// Get meta tags with caching
getOrGenerateCached(
  channelId: string
): Promise<MetaTagSet>

// Invalidate cached meta tags
invalidateCache(
  channelId: string
): Promise<void>

// Schedule background regeneration
scheduleRegeneration(
  channelId: string,
  priority?: 'high' | 'normal' | 'low',
  idempotencyKey?: string
): Promise<{ jobId: string, status: 'queued' | 'deduplicated' }>

// Get meta tags for admin preview
getMetaTagsForPreview(
  channelId: string
): Promise<MetaTagPreview>

// Poll status for a regeneration job
getRegenerationJobStatus(
  channelId: string,
  jobId: string
): Promise<MetaTagJobStatus>
```

**Generation and Override Rules:**
- Auto-generated values target SEO limits (`title <= 60`, `description <= 160`).
- Admin overrides (`custom_title`, `custom_description`, `custom_og_image`) always take precedence over generated values when present.
- Background regeneration updates generated fields only and must not overwrite custom override fields.
- If NLP analysis fails or times out (>5s), generation falls back to channel/topic-based tags and marks `needs_regeneration=true`.

#### 9.1.2 CL-C2.2 TitleGenerator

**Public Methods:**

```typescript
// Generate title from channel data
generateFromChannel(
  channel: Channel,
  server: Server
): string

// Generate title for specific message deep link
generateFromMessage(
  message: Message,
  channel: Channel
): string

// Generate title for thread view
generateFromThread(
  messages: Message[],
  channel: Channel
): string
```

**Private Methods:**

```typescript
private truncateWithEllipsis(
  text: string,
  maxLength: number
): string

private sanitizeForTitle(
  text: string
): string

private applyTemplate(
  template: string,
  data: TitleData
): string
```

**Length Policy:** `TitleGenerator` output is capped at 60 characters. Longer admin overrides are allowed via `MetaTagOverride.customTitle` (max 70).

#### 9.1.3 CL-C2.3 DescriptionGenerator

**Public Methods:**

```typescript
// Generate description from messages
generateFromMessages(
  messages: Message[],
  channel: Channel
): string

// Extract key phrases for description
extractKeyPhrases(
  content: string,
  maxPhrases: number
): string[]

// Summarize thread for description
summarizeThread(
  messages: Message[]
): string
```

**Length Policy:** `DescriptionGenerator` output is capped at 160 characters. Longer admin overrides are allowed via `MetaTagOverride.customDescription` (max 200).

#### 9.1.4 CL-C2.4 OpenGraphGenerator

**Public Methods:**

```typescript
// Generate Open Graph tags
generateOGTags(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): OpenGraphTags

// Generate Twitter Card tags
generateTwitterCard(
  channel: Channel,
  server: Server,
  analysis: ContentAnalysis
): TwitterCardTags

// Select best preview image
selectPreviewImage(
  channel: Channel,
  messages: Message[]
): string | null
```

**Twitter Card Rule:** default to `summary`; switch to `summary_large_image` only when a valid large preview image is available.

#### 9.1.5 CL-C2.5 StructuredDataGenerator

**Public Methods:**

```typescript
// Generate DiscussionForumPosting schema
generateDiscussionForum(
  channel: Channel,
  messages: Message[],
  server: Server
): StructuredData

// Generate BreadcrumbList schema
generateBreadcrumbList(
  server: Server,
  channel: Channel
): StructuredData

// Generate Organization schema
generateOrganization(
  server: Server
): StructuredData

// Generate WebPage schema
generateWebPage(
  channel: Channel,
  metaTags: MetaTagSet
): StructuredData
```

### 9.2 Module M3: Content Analysis

#### 9.2.1 CL-C3.1 ContentAnalyzer

**Public Methods:**

```typescript
// Analyze thread content
analyzeThread(
  messages: Message[]
): Promise<ContentAnalysis>

// Get topic category
getTopicCategory(
  content: string
): string[]

// Get content sentiment
getSentiment(
  content: string
): 'positive' | 'negative' | 'neutral'

// Get reading level
getReadingLevel(
  content: string
): 'basic' | 'intermediate' | 'advanced'
```

**Error and Language Handling:**
- `analyzeThread()` must detect language before NLP processing.
- Supported languages for NLP templates: English, Spanish, French, German, Japanese.
- Unsupported languages use deterministic fallback generation (channel/server naming + first meaningful sentence).
- On analyzer exception/timeout (>5s), return fallback analysis and set `needs_regeneration=true` in persistence metadata.

#### 9.2.2 CL-C3.2 KeywordExtractor

**Public Methods:**

```typescript
// Extract keywords from content
extractKeywords(
  content: string,
  maxKeywords: number
): string[]

// Extract multi-word phrases
extractPhrases(
  content: string,
  maxPhrases: number
): string[]

// Score keywords by relevance
scoreByFrequency(
  keywords: string[],
  content: string
): ScoredKeyword[]
```

#### 9.2.3 CL-C3.3 TextSummarizer

**Public Methods:**

```typescript
// Summarize content to target length
summarize(
  content: string,
  targetLength: number
): string

// Extract first complete sentence
extractFirstSentence(
  content: string
): string

// Extract key sentences
extractKeySentences(
  content: string,
  maxSentences: number
): string[]
```

#### 9.2.4 CL-C3.4 TopicClassifier

**Public Methods:**

```typescript
// Classify content into topic categories
classify(
  content: string
): string[]

// Get top N topic categories
getTop(
  content: string,
  count: number
): string[]

// Get topic-related keywords
getKeywords(
  content: string
): string[]
```

### 9.3 Module M4: Background Processing

#### 9.3.1 CL-C4.1 MetaTagUpdateWorker

**Public Methods:**

```typescript
// Process a meta tag update job
processJob(
  job: MetaTagUpdateJob
): Promise<void>

// Schedule an update with debouncing
scheduleUpdate(
  channelId: string,
  delay: number
): Promise<void>

// Batch process multiple channels
batchProcess(
  channelIds: string[]
): Promise<void>
```

#### 9.3.2 CL-C4.2 EventListener

**Public Methods:**

```typescript
// Handle message created event
onMessageCreated(
  event: MessageCreatedEvent
): Promise<void>

// Handle message edited event
onMessageEdited(
  event: MessageEditedEvent
): Promise<void>

// Handle message deleted event
onMessageDeleted(
  event: MessageDeletedEvent
): Promise<void>

// Handle channel visibility change
onVisibilityChanged(
  event: VisibilityChangeEvent
): Promise<void>
```

#### 9.3.3 CL-C4.3 SitemapUpdater

**Public Methods:**

```typescript
// Update or remove URL in sitemap
updateLastModified(
  url: string,
  options?: { remove?: boolean }
): Promise<void>

// Notify search engines to crawl sitemap changes
notifySearchEngines(
  sitemapUrl: string
): Promise<void>

// Request de-index/removal for a URL after privacy change
requestDeindex(
  url: string,
  reason: 'visibility_private' | 'deleted'
): Promise<void>
```

### 9.4 Module M5: Data Access

#### 9.4.1 CL-C5.1 ChannelRepository

**Public Methods:**

```typescript
// Find channel by ID
findById(
  channelId: string
): Promise<Channel | null>

// Find channel by server and channel slugs
findBySlug(
  serverSlug: string,
  channelSlug: string
): Promise<Channel | null>

// Update channel data
update(
  channelId: string,
  data: Partial<Channel>
): Promise<Channel>

// Find all public channels for a server
findPublicByServerId(
  serverId: string
): Promise<Channel[]>

// Get channel visibility state
getVisibility(
  channelId: string
): Promise<ChannelVisibility>

// Get channel metadata
getMetadata(
  channelId: string
): Promise<ChannelMetadata>
```

#### 9.4.2 CL-C5.2 MessageRepository

**Public Methods:**

```typescript
// Find recent messages for a channel
findRecentByChannel(
  channelId: string,
  limit: number
): Promise<Message[]>

// Find first message in a channel
findFirstMessage(
  channelId: string
): Promise<Message | null>

// Get total message count for a channel
getMessageCount(
  channelId: string
): Promise<number>
```

#### 9.4.3 CL-C5.3 MetaTagRepository

**Public Methods:**

```typescript
// Find generated meta tags by channel ID
findByChannelId(
  channelId: string
): Promise<GeneratedMetaTags | null>

// Insert or update generated meta tags
upsert(
  channelId: string,
  metaTags: Partial<GeneratedMetaTags>
): Promise<GeneratedMetaTags>

// Get last generation timestamp for a channel
getLastGenerated(
  channelId: string
): Promise<DateTime | null>
```

### 9.5 Data Transfer Objects

#### 9.5.1 CL-D1 MetaTagSet

```typescript
interface MetaTagSet {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: OpenGraphTags;
  twitter: TwitterCardTags;
  structuredData: JSON;
  keywords: string[];
}
```

#### 9.5.2 CL-D2 OpenGraphTags

```typescript
interface OpenGraphTags {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;
}
```

#### 9.5.3 CL-D3 TwitterCardTags

```typescript
interface TwitterCardTags {
  card: string;
  title: string;
  description: string;
  image: string;
  site: string;
}
```

#### 9.5.4 CL-D4 StructuredData

```typescript
interface StructuredData {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  author: Person;
  datePublished: string;
  dateModified: string;
  mainEntity: object;
  breadcrumb: object;
}
```

#### 9.5.5 CL-D5 ContentAnalysis

```typescript
interface ContentAnalysis {
  keywords: string[];
  topics: string[];
  summary: string;
  sentiment: string;
  readingLevel: string;
}
```

### 9.6 Domain Entities

#### 9.6.1 CL-E1 Channel

```typescript
interface Channel {
  id: UUID;
  serverId: UUID;
  name: string;
  slug: string;
  topic: string;
  visibility: ChannelVisibility;
}
```

#### 9.6.2 CL-E2 Message

```typescript
interface Message {
  id: UUID;
  channelId: UUID;
  authorId: UUID;
  content: string;
  createdAt: DateTime;
  attachments: Attachment[];
}
```

#### 9.6.3 CL-E3 GeneratedMetaTags

```typescript
interface GeneratedMetaTags {
  id: UUID;
  channelId: UUID;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string[];
  structuredData: JSON;
  generatedAt: DateTime;
  contentHash: string;
  version: number;
}
```

### 9.7 Rationale
This gives us good APIs to utilize in our implementation. Everything is kept seperate and is modularized which makes for good development practice. We did need to reprompt to ensure that all classes and methods mentioned previoiusly in section 3 were present in this section and vice versa. 

---

## 10. Public Interfaces

### 10.1 Cross-Module Interface Usage

#### Used by Page Rendering (M1) from Meta Tag Generation (M2):

| Method | Class | Used For |
|--------|-------|----------|
| getOrGenerateCached() | MetaTagService | SSR meta tag injection |
| generateMetaTags() | MetaTagService | Force regeneration |

#### Used by Meta Tag Generation (M2) from Content Analysis (M3):

| Method | Class | Used For |
|--------|-------|----------|
| analyzeThread() | ContentAnalyzer | Content understanding |
| getTopicCategory() | ContentAnalyzer | Topic categorization |
| getSentiment() | ContentAnalyzer | Sentiment analysis |
| getReadingLevel() | ContentAnalyzer | Reading level assessment |
| extractKeywords() | KeywordExtractor | Keyword meta tag |
| extractPhrases() | KeywordExtractor | Multi-word keyword extraction |
| scoreByFrequency() | KeywordExtractor | Keyword relevance scoring |
| summarize() | TextSummarizer | Description generation |
| extractFirstSentence() | TextSummarizer | Fallback description extraction |
| extractKeySentences() | TextSummarizer | Key sentence extraction |
| classify() | TopicClassifier | Topic classification |
| getTop() | TopicClassifier | Top category selection |
| getKeywords() | TopicClassifier | Topic-related keyword extraction |

#### Used by Meta Tag Generation (M2) from Data Access (M5):

| Method | Class | Used For |
|--------|-------|----------|
| findById() | ChannelRepository | Resolve channel for admin and regeneration paths |
| findBySlug() | ChannelRepository | Resolve canonical route channel for SSR generation |
| findPublicByServerId() | ChannelRepository | Enumerate public channels for sitemap/meta refresh sweeps |
| getVisibility() | ChannelRepository | Visibility gating for serving/de-index decisions |
| getMetadata() | ChannelRepository | Channel/server metadata for title/description templates |
| findByChannelId() | MetaTagRepository | Retrieve existing tags |
| upsert() | MetaTagRepository | Persist new tags |
| getLastGenerated() | MetaTagRepository | Check tag freshness |
| findRecentByChannel() | MessageRepository | Get content for analysis |
| findFirstMessage() | MessageRepository | Get first message for fallback description |
| getMessageCount() | MessageRepository | Get message count for structured data |

#### Used by Background Processing (M4) from Meta Tag Generation (M2):

| Method | Class | Used For |
|--------|-------|----------|
| generateMetaTags() | MetaTagService | Background regeneration |
| invalidateCache() | MetaTagService | Cache management |
| scheduleRegeneration() | MetaTagService | Queue background meta tag updates |

**Cross-Reference:** The guest public channel view feature's `SEOService` is an adapter that delegates generation to `MetaTagService.getOrGenerateCached()` from this spec.

#### Cross-Spec Visibility Event Contract (`VISIBILITY_CHANGED`)

| New Visibility | Expected Payload Fields | SEO Action |
|----------------|-------------------------|------------|
| `PUBLIC_INDEXABLE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration, refresh tags, keep canonical URL indexable |
| `PUBLIC_NO_INDEX` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Queue regeneration with `noindex` directives while keeping page publicly accessible |
| `PRIVATE` | `channelId`, `oldVisibility`, `newVisibility`, `actorId`, `timestamp` | Invalidate cache, remove/purge URL, request de-index/removal |

### 10.2 Admin API Interface

```yaml
openapi: 3.0.3
info:
  title: Harmony Meta Tag Management API
  version: 1.0.0

paths:
  /api/admin/channels/{channelId}/meta-tags:
    get:
      summary: Get current meta tags for channel
      security:
        - bearerAuth: []
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Meta tags retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaTagPreview'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '403':
          description: Forbidden (admin role required)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Channel not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    put:
      summary: Update meta tags (custom override)
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MetaTagOverride'
      responses:
        '200':
          description: Meta tags updated
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel not found
        '422':
          description: Validation error (length, format, sanitization)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

    post:
      summary: Regenerate meta tags asynchronously
      security:
        - bearerAuth: []
      parameters:
        - name: Idempotency-Key
          in: header
          required: false
          schema:
            type: string
          description: Optional dedupe key for safe retries
      responses:
        '202':
          description: Regeneration scheduled (or deduplicated)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RegenerationJobAccepted'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel not found
        '409':
          description: Duplicate active request without valid idempotency key
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '500':
          description: Queue or scheduling failure
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /api/admin/channels/{channelId}/meta-tags/jobs/{jobId}:
    get:
      summary: Get regeneration job status
      security:
        - bearerAuth: []
      parameters:
        - name: channelId
          in: path
          required: true
          schema:
            type: string
            format: uuid
        - name: jobId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Job status retrieved
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MetaTagJobStatus'
        '401':
          description: Unauthorized
        '403':
          description: Forbidden (admin role required)
        '404':
          description: Channel/job not found

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    MetaTagPreview:
      type: object
      properties:
        title:
          type: string
          description: Effective title served in HTML (generated <=60; custom override <=70)
          maxLength: 70
        description:
          type: string
          description: Effective description served in HTML (generated <=160; custom override <=200)
          maxLength: 200
        ogTitle:
          type: string
        ogDescription:
          type: string
        ogImage:
          type: string
          format: uri
        keywords:
          type: array
          items:
            type: string
        generatedAt:
          type: string
          format: date-time
        isCustom:
          type: boolean
        searchPreview:
          $ref: '#/components/schemas/SearchPreview'
        socialPreview:
          $ref: '#/components/schemas/SocialPreview'

    MetaTagOverride:
      type: object
      properties:
        customTitle:
          type: string
          maxLength: 70
        customDescription:
          type: string
          maxLength: 200
        customOgImage:
          type: string
          format: uri

    RegenerationJobAccepted:
      type: object
      properties:
        jobId:
          type: string
        status:
          type: string
          enum: [queued, deduplicated]
        idempotencyKey:
          type: string
          nullable: true
        pollUrl:
          type: string
          format: uri

    MetaTagJobStatus:
      type: object
      properties:
        jobId:
          type: string
        channelId:
          type: string
          format: uuid
        status:
          type: string
          enum: [queued, processing, succeeded, failed]
        attempts:
          type: integer
        startedAt:
          type: string
          format: date-time
          nullable: true
        completedAt:
          type: string
          format: date-time
          nullable: true
        errorCode:
          type: string
          nullable: true
        errorMessage:
          type: string
          nullable: true

    ErrorResponse:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        requestId:
          type: string

    SearchPreview:
      type: object
      properties:
        title:
          type: string
        url:
          type: string
        description:
          type: string

    SocialPreview:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        image:
          type: string
```

### 10.3 Rationale
The LLM did a good job of generating the correct interface and APIs for the feature. It went into depth on how the API can be called and the different responses it needed to have. We only reprompted to ensure that this section was consistent with the classes made in previous sections.

---

## 11. Data Schemas

### 11.1 Database Tables

#### D6.1 ChannelsTable (Canonical Shared Schema)

**Runtime Class:** CL-E1 Channel

This feature consumes the canonical `channels` schema maintained by the channel visibility spec (`docs/dev-spec-channel-visibility-toggle.md`, Section 11.1 D7.1) to avoid drift.

| Column | Database Type | Constraints | Description |
|--------|---------------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique channel identifier |
| server_id | UUID | FOREIGN KEY → servers(id), NOT NULL, INDEX | Parent server reference |
| name | VARCHAR(100) | NOT NULL | Display name |
| slug | VARCHAR(100) | NOT NULL, UNIQUE per server | URL-safe identifier |
| visibility | visibility_enum | NOT NULL, DEFAULT 'PRIVATE' | Canonical visibility state |
| topic | TEXT | NULL | Channel topic/description |
| position | INTEGER | NOT NULL, DEFAULT 0 | Display order within server |
| indexed_at | TIMESTAMP WITH TIME ZONE | NULL | When channel was added to sitemap |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Visibility Enum:** `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`

**Canonical Index Set (shared):** `idx_channels_server_visibility`, `idx_channels_server_slug`, `idx_channels_visibility_indexed`, `idx_channels_visibility`

#### D6.2 MessagesTable and D6.4 ServersTable (Shared References)

Message and server schemas are shared with the guest public channel view spec and must remain source-aligned there to prevent cross-spec schema drift.

#### D6.3 GeneratedMetaTagsTable

**Runtime Class:** CL-E3 GeneratedMetaTags

| Column | Database Type | Constraints | Description | Storage Est. |
|--------|--------------|-------------|-------------|--------------|
| id | UUID | PRIMARY KEY | Unique record identifier | 16 bytes |
| channel_id | UUID | FOREIGN KEY, UNIQUE, INDEX | Associated channel | 16 bytes |
| title | VARCHAR(70) | NOT NULL | SEO title tag | 70 bytes |
| description | VARCHAR(200) | NOT NULL | Meta description | 200 bytes |
| og_title | VARCHAR(95) | NOT NULL | Open Graph title | 95 bytes |
| og_description | VARCHAR(300) | NOT NULL | Open Graph description | 300 bytes |
| og_image | VARCHAR(500) | NULL | Preview image URL | 500 bytes |
| twitter_card | VARCHAR(20) | NOT NULL, DEFAULT 'summary' | Twitter card type | 20 bytes |
| keywords | TEXT[] | NOT NULL, DEFAULT '{}' | Extracted keywords | ~200 bytes |
| structured_data | JSONB | NOT NULL | JSON-LD data | ~1000 bytes |
| custom_title | VARCHAR(70) | NULL | Admin override title | 70 bytes |
| custom_description | VARCHAR(200) | NULL | Admin override description | 200 bytes |
| custom_og_image | VARCHAR(500) | NULL | Admin override image | 500 bytes |
| content_hash | VARCHAR(64) | NOT NULL | SHA-256 of source content | 64 bytes |
| needs_regeneration | BOOLEAN | NOT NULL, DEFAULT false | Set when fallback generation is used and retry is required | 1 byte |
| generated_at | TIMESTAMP WITH TIME ZONE | NOT NULL | Last generation time | 8 bytes |
| version | INTEGER | NOT NULL, DEFAULT 1 | Generation version | 4 bytes |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation | 8 bytes |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update | 8 bytes |

**Indexes:**
```sql
CREATE UNIQUE INDEX idx_meta_tags_channel ON generated_meta_tags(channel_id);
CREATE INDEX idx_meta_tags_generated ON generated_meta_tags(generated_at);
```

**Length Normalization Policy:**
- Auto-generated `title` values are limited to 60 chars and auto-generated `description` values to 160 chars.
- Database/API allow up to 70/200 to support intentional admin overrides.
- Rendering must always use sanitized effective values and must not exceed schema max lengths.

**Content Hash Calculation:** `content_hash = SHA-256(join(last_100_non_deleted_message_contents, "\n"))`. Author IDs, timestamps, and attachment metadata are excluded so metadata-only updates do not force regeneration.

**Storage Estimate:** ~3.4 KB per channel

### 11.2 Cache Schemas

#### D7.1 MetaTagCache

**Key Pattern:** `meta:channel:{channelId}`
**Value Type:** JSON serialized MetaTagSet
**TTL:** 3600 seconds (1 hour)
**Size:** ~2 KB per entry

#### D7.2 ContentAnalysisCache

**Key Pattern:** `analysis:channel:{channelId}`
**Value Type:** JSON serialized ContentAnalysis
**TTL:** 1800 seconds (30 minutes)
**Size:** ~500 bytes per entry

### 11.3 Job Queue Schema

#### D8.1 MetaTagUpdateQueue

**Queue Name:** `meta-tag-updates`
**Job Data:**
```typescript
{
  jobId: string,          // Queue job identifier
  channelId: string,      // UUID
  priority: 'high' | 'normal' | 'low',
  triggeredBy: 'message' | 'edit' | 'manual' | 'schedule' | 'visibility',
  idempotencyKey?: string,
  status: 'queued' | 'processing' | 'succeeded' | 'failed',
  attemptCount: number,
  lastError?: string
}
```
**Default Delay:** 60 seconds (debounce)
**Max Attempts:** 3
**Backoff:** Exponential (1min, 5min, 15min)
**Deduplication Window:** 60 seconds per `(channelId, idempotencyKey)`

### 11.4 Rationale
This section needed reprompting to ensure alignment across the data schemas in each spec. Besides that, these are valid schemas to use for our app and provides us a good way to store our data. The database tables will be stored in a PostgreSQL database adn the caching layer will be in a Redis service. This allows us to have quick access to recent meta tag generations and to easily serve the search engine.

---

## 12. Security and Privacy

### 12.1 Content Filtering for Meta Tags

| Filter Type | Implementation | Purpose |
|-------------|----------------|---------|
| PII Detection | Regex for emails, phones, @mentions — `ContentFilter.filterPII` | Prevent personal info in search results |
| Profanity Filter | Word list + pattern matching, replaced with asterisks matching the word length (e.g., `damn` → `****`) — `ContentFilter.filterProfanity` | Prevent inappropriate previews |
| Private Mention Redaction | `@mention` → `[user]` via `ContentFilter.filterPII` | Respect user privacy settings |
| URL Sanitization | Remove internal/private links | Prevent link leakage |
| HTML Entity Encoding | `ContentFilter.escapeHtml` / `ContentFilter.sanitizeForHead` | Prevent XSS in `<head>` |

**Implementation:** `src/services/metaTag/contentFilter.ts` exports `ContentFilter` with:
- `filterPII(text)` — redacts emails, phone numbers, @mentions
- `filterProfanity(text)` — replaces word-list matches with asterisks
- `filterContent(text)` — runs PII then profanity pipeline (used in `metaTagService.generateMetaTagsFromContext`)
- `escapeHtml(text)` — HTML-entity-encodes `& < > " ' /`
- `sanitizeForHead(text)` — strips HTML tags then calls `escapeHtml`; used by `metaTagService.sanitizeCustomOverride` on write path

**Tests:** `tests/contentFilter.test.ts` covers PII/profanity fixture corpus (AC-8), XSS attribute-injection fixtures, and `<head>` output snapshots.

### 12.2 Data Flow Security

```
Message Content                 Content Analysis              Meta Tag Output
───────────────                 ────────────────              ───────────────
    │                                │                              │
    │                                │                              │
    ▼                                ▼                              ▼
┌─────────────┐              ┌─────────────────┐            ┌─────────────────┐
│ Raw content │─────────────►│ Sanitize input  │            │ HTML-encoded    │
│ from DB     │              │ - Remove HTML   │            │ output          │
│             │              │ - Normalize     │            │                 │
│             │              │   whitespace    │            │ Safe for        │
│             │              └────────┬────────┘            │ embedding in    │
│             │                       │                     │ <meta> tags     │
└─────────────┘                       ▼                     └─────────────────┘
                             ┌─────────────────┐
                             │ Filter PII      │
                             │ - Emails        │
                             │ - Phone numbers │
                             │ - @mentions     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Filter profanity│
                             │ - Word list     │
                             │ - Replace with  │
                             │   asterisks     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Generate tags   │
                             │ from clean      │
                             │ content         │
                             └─────────────────┘
```

### 12.3 Admin Override Security

- Only server admins can set custom meta tags
- Custom tags still undergo sanitization via `metaTagService.sanitizeCustomOverride` (strips HTML, filters PII/profanity, HTML-entity-encodes) before being stored or served
- Audit log records all custom tag changes
- Rate limiting on regeneration requests

### 12.4 Search Engine Guidelines Compliance

| Guideline | Implementation |
|-----------|----------------|
| No keyword stuffing | Limit keywords to 5-10 relevant terms |
| Accurate descriptions | Summarize actual content, not clickbait |
| No cloaking | Same content for bots and users |
| Unique titles | Template ensures uniqueness per channel |
| Appropriate length | Auto-generated title <=60 and description <=160; effective tags may be up to 70/200 only when admin overrides are explicitly configured |

### 12.5 Rationale
Security is an absolute need for this kind of product and this flow provides for us a way to keep our users data secure while still allowing search engines to index our public servers. No changes were needed from the LLM's response.

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T8: natural (NLP) | Medium | Medium | Medium | High | Medium |
| T9: compromise | Medium | Low | Low | Medium | Low |
| T7: BullMQ | Low | Low | Low | Low | Low |
| T10: schema-dts | Low | Medium | Low | Medium | Low |

### 13.2 Algorithm Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| Keyword Extraction | Low relevance keywords | Human review for top channels; feedback loop |
| Text Summarization | Awkward truncation | Sentence-boundary aware truncation |
| Topic Classification | Misclassification | Fallback to generic; expandable categories |
| Title Generation | Generic/duplicate titles | Template variants; uniqueness check |

### 13.3 Quality Assurance Challenges

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Subjective quality | Hard to automate testing | A/B testing; CTR monitoring |
| Language variations | Non-English content | Language detection; appropriate templates |
| Content diversity | Different channel types | Multiple generation strategies |
| Evolving SEO best practices | Outdated optimization | Regular review; configurable parameters |

### 13.4 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| NLP library issues | >5% error rate | Fallback to simple extraction |
| Queue overload | >1000 pending jobs | Batch processing; priority queue |
| Poor search rankings | CTR <1% | Manual review; algorithm tuning |
| Generation too slow | >5s per channel | Pre-generate on schedule |

### 13.5 Rollout and Feature Flag Plan

| Phase | Scope | Gate | Rollback Trigger |
|-------|-------|------|------------------|
| Phase 1: Shadow | Generate + store tags, do not serve | Manual QA on 100 sampled channels | Any PII/profanity leak |
| Phase 2: Limited Serve | Serve auto tags for 10% of public channels | CTR/search impressions no worse than control | >5% job failures or quality alerts |
| Phase 3: Full Serve | Serve for all eligible public channels | Stable metrics for 7 consecutive days | Any Critical alert from §7.6 |

**Feature Flags:**
- `FEATURE_SEO_META_TAGS`: master switch for serving generated tags.
- `FEATURE_SEO_META_TAGS_SHADOW_MODE`: generate-only mode with no serving impact.
- `FEATURE_SEO_DEINDEX_ON_PRIVATE`: enables automatic de-index workflow on privacy transitions.

**Rollback Procedure:** disable `FEATURE_SEO_META_TAGS` to immediately revert to fallback templates while jobs continue in shadow mode for diagnostics.

### 13.6 Rationale
This is a large application so these are some of the valid risks to complete this feature. The LLM is justified in all of these risks for maintain this platform for a long period of time. The only addition was adding a rollout plan so that we can test the meta tags and see how the system responds.

---

## 14. Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |

### 14.1 Rationale
This is something extra that the LLM added after a review of the spec. This will be helpful for the LLM to know that this feature is finished and fully working.

## Appendix A: Meta Tag Templates

### Title Templates

```
// Channel page
"{ChannelName} - {ServerName} | Harmony"
// Max 60 chars, truncate channel name first

// Message deep link
"{MessagePreview} - {ChannelName} | Harmony"
// Max 60 chars, truncate message preview first

// Search result
"{TopKeyword} Discussion - {ServerName}"
// Used when channel name is generic
```

### Description Templates

```
// Standard
"Join the discussion about {topics} in {ServerName}.
{SummarySentence} {MessageCount} messages from {AuthorCount} members."

// Minimal (when content is sparse)
"Community discussion channel for {topics}.
Part of the {ServerName} community on Harmony."
```

### Structured Data Template (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "{title}",
  "description": "{description}",
  "url": "{canonicalUrl}",
  "datePublished": "{firstMessageDate}",
  "dateModified": "{lastMessageDate}",
  "author": {
    "@type": "Organization",
    "name": "{serverName}"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": "{messageCount}"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "Harmony",
    "url": "https://harmony.app"
  }
}
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| Meta Tags | HTML elements in <head> that provide metadata about the page |
| Open Graph | Protocol for social media link previews (og: tags) |
| Twitter Card | Twitter's format for rich link previews |
| JSON-LD | JavaScript Object Notation for Linked Data (structured data) |
| Rich Snippet | Enhanced search result with additional information |
| SERP | Search Engine Results Page |
| CTR | Click-Through Rate - percentage of impressions resulting in clicks |
| Canonical URL | The authoritative URL for a page |
| NLP | Natural Language Processing |
| Debounce | Technique to limit how often a function runs |
