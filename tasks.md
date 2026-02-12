# Implementation Plan: NyaySetu

## Overview

This implementation plan breaks down the NyaySetu platform into discrete, incremental coding tasks. The approach follows a bottom-up strategy: building core utilities and services first, then integrating them into the API layer, and finally connecting the frontend. Each task builds on previous work, ensuring no orphaned code.

The implementation uses Python (FastAPI) for the backend and React (Next.js) for the frontend, with Gemini API for AI operations and Firebase/Supabase for data storage.

## Tasks

- [ ] 1. Set up project structure and development environment
  - Create backend directory structure (app/, services/, models/, utils/, tests/)
  - Create frontend directory structure (components/, pages/, lib/, styles/)
  - Set up Python virtual environment and install dependencies (FastAPI, uvicorn, python-multipart, firebase-admin, google-generativeai, redis, pdf-parse libraries)
  - Set up Next.js project with TypeScript and Tailwind CSS
  - Configure environment variables for API keys and database credentials
  - Set up Git repository with .gitignore for sensitive files
  - _Requirements: Infrastructure setup_

- [ ] 2. Implement core utility modules
  - [ ] 2.1 Create error handling utilities
    - Implement custom exception classes for different error types (UserError, SystemError, LLMError)
    - Create error handler middleware for FastAPI
    - Implement error message localization dictionary for all supported languages
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ]* 2.2 Write property tests for error handling
    - **Property 4: Error Message Localization**
    - **Validates: Requirements 1.4, 10.1, 10.3**
    - **Property 33: Error Categorization**
    - **Validates: Requirements 10.2**
  
  - [ ] 2.3 Create prompt template manager
    - Implement PromptTemplateManager class with methods for translation, summarization, legal query, and classification prompts
    - Create prompt templates with Indian legal context and bias mitigation instructions
    - Add template versioning support
    - _Requirements: 8.2, 8.6_
  
  - [ ]* 2.4 Write property tests for prompt templates
    - **Property 25: Indian Legal Context in Prompts**
    - **Validates: Requirements 8.2**
    - **Property 29: Bias Mitigation in Prompts**
    - **Validates: Requirements 8.6**
  
  - [ ] 2.5 Implement cache manager
    - Create CacheManager class using Redis client
    - Implement get, set, delete, exists methods
    - Create cache key generation logic for translations and summaries
    - _Requirements: 9.4_

- [ ] 3. Implement Gemini API client with retry logic
  - [ ] 3.1 Create GeminiAPIClient class
    - Initialize Gemini API client with API key
    - Implement generateContent method with basic error handling
    - Implement response validation logic
    - _Requirements: 8.1, 8.5_
  
  - [ ] 3.2 Add rate limiting and retry logic
    - Implement rate limiter (60 requests per minute)
    - Implement exponential backoff retry logic with configurable max retries
    - Add circuit breaker pattern for repeated failures
    - _Requirements: 8.3, 8.4_
  
  - [ ]* 3.3 Write property tests for Gemini client
    - **Property 26: API Rate Limiting**
    - **Validates: Requirements 8.3**
    - **Property 27: Exponential Backoff Retry**
    - **Validates: Requirements 8.4**
    - **Property 28: Response Completeness Validation**
    - **Validates: Requirements 8.5**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement document processing service
  - [ ] 5.1 Create document validation logic
    - Implement file size validation (max 10MB)
    - Implement file format validation (.pdf, .txt, .docx)
    - Implement file integrity checking using magic number validation
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ]* 5.2 Write property tests for document validation
    - **Property 1: File Size Validation**
    - **Validates: Requirements 1.1**
    - **Property 2: File Format Validation**
    - **Validates: Requirements 1.2**
    - **Property 3: File Integrity Validation**
    - **Validates: Requirements 1.3**
  
  - [ ] 5.3 Implement PDF and document parsing
    - Implement PDF text extraction using PyPDF2 or pdfplumber
    - Implement .txt file reading
    - Implement .docx parsing using python-docx
    - Extract and preserve formatting metadata (paragraphs, lists, tables)
    - _Requirements: 1.5, 11.1, 11.2, 11.5_
  
  - [ ] 5.4 Create DocumentService class
    - Implement parseDocument method
    - Implement storeDocument method with encryption
    - Implement retrieveDocument method
    - Implement deleteDocument method with permanent removal
    - _Requirements: 7.2, 7.3_
  
  - [ ]* 5.5 Write property tests for document service
    - **Property 23: Document Deletion**
    - **Validates: Requirements 7.3**

- [ ] 6. Implement translation service
  - [ ] 6.1 Create TranslationService class
    - Implement translate method that calls Gemini API with translation prompt
    - Implement format preservation logic for paragraphs, lists, and formatting
    - Implement legal term consistency tracking
    - Add caching integration for translated documents
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 6.2 Write property tests for translation service
    - **Property 5: Translation Language Support**
    - **Validates: Requirements 2.1, 2.2**
    - **Property 6: Legal Term Consistency**
    - **Validates: Requirements 2.3**
    - **Property 7: Format Preservation in Translation**
    - **Validates: Requirements 2.4, 11.1, 11.2, 11.3, 11.4, 11.5**
    - **Property 8: Translation Retry Logic**
    - **Validates: Requirements 2.5**
  
  - [ ] 6.3 Implement batch translation for large documents
    - Split large documents into chunks
    - Implement parallel translation with rate limiting
    - Reassemble translated chunks with format preservation
    - _Requirements: 2.2, 2.4_

- [ ] 7. Implement summarization service
  - [ ] 7.1 Create SummarizationService class
    - Implement summarize method that calls Gemini API with summarization prompt
    - Implement key elements extraction (parties, issue, decision, reasoning)
    - Implement word count validation (max 500 words for <20 pages)
    - Add caching integration for summaries
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ]* 7.2 Write property tests for summarization service
    - **Property 9: Summary Word Count Limit**
    - **Validates: Requirements 3.1**
    - **Property 10: Summary Required Elements**
    - **Validates: Requirements 3.2**
    - **Property 11: Summary and Full Text Display**
    - **Validates: Requirements 3.4**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement legal query service
  - [ ] 9.1 Create case classification logic
    - Implement classifyCase method that calls Gemini API with classification prompt
    - Parse classification response (categories, confidence, clarifying questions)
    - Implement confidence threshold logic (ask questions if <70%)
    - _Requirements: 4.2, 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 9.2 Write property tests for case classification
    - **Property 13: Case Category Classification**
    - **Validates: Requirements 4.2, 14.1**
    - **Property 14: Multi-Category Classification**
    - **Validates: Requirements 14.2**
    - **Property 16: Confidence-Based Clarification**
    - **Validates: Requirements 14.4**
  
  - [ ] 9.3 Create LegalQueryService class
    - Implement analyzeQuery method that orchestrates classification and guidance generation
    - Implement identifyRelevantLaws method
    - Implement generateActionChecklist method (3-7 steps)
    - Implement advocate type recommendation logic
    - Add disclaimer text to all responses
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 6.3, 6.4, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 9.4 Write property tests for legal query service
    - **Property 12: Multilingual Query Processing**
    - **Validates: Requirements 4.1**
    - **Property 15: Legal Guidance Completeness**
    - **Validates: Requirements 4.3, 4.4, 4.5, 4.6, 15.1, 15.2, 15.3**
    - **Property 17: Legal Aid Information Inclusion**
    - **Validates: Requirements 15.5**
    - **Property 21: Disclaimer Presence in Guidance**
    - **Validates: Requirements 6.3, 6.4**
  
  - [ ] 9.5 Implement legal knowledge validation
    - Create validation logic for constitutional article references
    - Create validation logic for law references (IPC, CrPC, CPC)
    - _Requirements: 12.1, 12.2_
  
  - [ ]* 9.6 Write property tests for legal knowledge validation
    - **Property 35: Constitutional Article Validity**
    - **Validates: Requirements 12.1**
    - **Property 36: Legal Reference Validity**
    - **Validates: Requirements 12.2**

- [ ] 10. Implement user session service
  - [ ] 10.1 Set up Firebase/Supabase authentication
    - Initialize Firebase Admin SDK or Supabase client
    - Implement user registration endpoint
    - Implement user login endpoint with JWT token generation
    - Implement logout endpoint
    - _Requirements: 7.6_
  
  - [ ] 10.2 Create UserSessionService class
    - Implement getUserPreferences method
    - Implement updateUserPreferences method with language persistence
    - Implement getUserHistory method
    - _Requirements: 5.2_
  
  - [ ]* 10.3 Write property tests for user session service
    - **Property 18: Language Preference Persistence**
    - **Validates: Requirements 5.2**

- [ ] 11. Implement FastAPI backend endpoints
  - [ ] 11.1 Create document upload endpoints
    - POST /api/documents/upload - handle multipart file upload with validation
    - GET /api/documents/{documentId}/status - return processing status
    - DELETE /api/documents/{documentId} - handle document deletion
    - Implement async processing with background tasks
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.3, 9.2_
  
  - [ ]* 11.2 Write property tests for document endpoints
    - **Property 30: Asynchronous Document Processing**
    - **Validates: Requirements 9.2**
  
  - [ ] 11.3 Create translation and summarization endpoints
    - POST /api/documents/{documentId}/translate - handle translation requests
    - POST /api/documents/{documentId}/summarize - handle summarization requests
    - Implement caching checks before processing
    - _Requirements: 2.1, 2.2, 3.1, 9.4_
  
  - [ ]* 11.4 Write property tests for translation endpoints
    - **Property 31: Translation Caching**
    - **Validates: Requirements 9.4**
  
  - [ ] 11.5 Create legal query endpoints
    - POST /api/legal-query/analyze - handle legal query analysis
    - POST /api/legal-query/classify - handle case classification
    - Implement PII filtering in logging
    - _Requirements: 4.1, 4.2, 7.5_
  
  - [ ]* 11.6 Write property tests for legal query endpoints
    - **Property 24: PII Logging Prevention**
    - **Validates: Requirements 7.5**
  
  - [ ] 11.7 Create user session endpoints
    - POST /api/auth/register
    - POST /api/auth/login
    - POST /api/auth/logout
    - GET /api/user/preferences
    - PUT /api/user/preferences
    - GET /api/user/history
    - _Requirements: 5.2, 7.6_
  
  - [ ] 11.8 Add HTTPS configuration and security middleware
    - Configure HTTPS/TLS
    - Add CORS middleware
    - Add authentication middleware
    - Add rate limiting middleware
    - _Requirements: 7.1, 8.3_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement frontend components
  - [ ] 13.1 Set up internationalization (i18n)
    - Configure next-i18next for multilingual support
    - Create translation files for all supported languages (en, hi, ta, bn, mr, te, kn)
    - Implement language selector component
    - Implement language preference persistence in localStorage
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 13.2 Write property tests for i18n
    - **Property 19: Complete UI Translation**
    - **Validates: Requirements 5.3**
    - **Property 20: Browser Language Default**
    - **Validates: Requirements 5.5**
  
  - [ ] 13.3 Create DisclaimerModal component
    - Implement modal that displays on first visit
    - Add accept/decline buttons
    - Store acceptance in localStorage
    - Display disclaimer text in user's language
    - _Requirements: 6.1, 6.2_
  
  - [ ] 13.4 Create DocumentUpload component
    - Implement file input with drag-and-drop support
    - Add file validation (size, format) on client side
    - Display upload progress indicator
    - Show success/error messages in user's language
    - _Requirements: 1.1, 1.2, 13.3_
  
  - [ ]* 13.5 Write property tests for DocumentUpload component
    - **Property 37: Visual Feedback for Actions**
    - **Validates: Requirements 13.3**
  
  - [ ] 13.6 Create DocumentViewer component
    - Implement side-by-side view for original and translated text
    - Add summary display section
    - Implement text formatting preservation display
    - Add audio output option using Web Speech API
    - _Requirements: 2.4, 3.4, 11.1, 11.2, 11.3, 13.5_
  
  - [ ] 13.7 Create LegalQueryChat component
    - Implement chat interface with message history
    - Add input field with language detection
    - Display legal guidance with structured formatting (categories, laws, checklist)
    - Display disclaimer with each response
    - Add manual category correction option
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.3, 14.5_
  
  - [ ] 13.8 Implement keyboard navigation and accessibility
    - Add keyboard navigation support to all interactive elements
    - Add ARIA labels for screen readers
    - Ensure minimum font size of 16px for body text
    - Add focus indicators for keyboard navigation
    - _Requirements: 13.2, 13.4_
  
  - [ ]* 13.9 Write property tests for accessibility
    - **Property 38: Keyboard Navigation Support**
    - **Validates: Requirements 13.4**

- [ ] 14. Create main application pages
  - [ ] 14.1 Create home page
    - Implement landing page with language selector
    - Add navigation to document upload and legal query features
    - Display disclaimer modal on first visit
    - _Requirements: 5.1, 6.1_
  
  - [ ] 14.2 Create document processing page
    - Integrate DocumentUpload component
    - Integrate DocumentViewer component
    - Add translation and summarization controls
    - Handle loading states and errors
    - _Requirements: 1.1, 2.1, 3.1_
  
  - [ ] 14.3 Create legal query page
    - Integrate LegalQueryChat component
    - Add conversation history display
    - Implement feedback mechanism
    - _Requirements: 4.1, 10.5_
  
  - [ ] 14.4 Create user profile page
    - Display user preferences
    - Allow language preference updates
    - Display query and document history
    - _Requirements: 5.2_

- [ ] 15. Implement database models and storage
  - [ ] 15.1 Create Firestore/Supabase collections and schemas
    - Define Users collection schema
    - Define Documents collection schema
    - Define Translations collection schema
    - Define Summaries collection schema
    - Define QueryHistory collection schema
    - _Requirements: 7.2_
  
  - [ ] 15.2 Implement data access layer
    - Create database client initialization
    - Implement CRUD operations for each collection
    - Add encryption for document storage
    - Implement query indexing for performance
    - _Requirements: 7.2, 7.3_

- [ ] 16. Implement queue management for high load
  - [ ] 16.1 Create request queue system
    - Implement queue using Redis or in-memory queue
    - Add queue position tracking
    - Implement queue worker for processing requests
    - _Requirements: 9.2, 9.5_
  
  - [ ]* 16.2 Write property tests for queue management
    - **Property 32: Queue Position Display**
    - **Validates: Requirements 9.5**

- [ ] 17. Final integration and end-to-end testing
  - [ ] 17.1 Wire all components together
    - Connect frontend to backend API
    - Test complete document upload → translation → summarization flow
    - Test complete legal query → analysis → guidance flow
    - Test user registration → preference setting → history viewing flow
    - _Requirements: All requirements_
  
  - [ ]* 17.2 Write integration tests
    - Test document processing pipeline end-to-end
    - Test legal query pipeline end-to-end
    - Test user session management end-to-end
    - Test error handling across all flows
    - _Requirements: All requirements_
  
  - [ ] 17.3 Perform security testing
    - Test HTTPS enforcement
    - Test authentication and authorization
    - Test input validation and sanitization
    - Test rate limiting
    - Test data encryption
    - _Requirements: 7.1, 7.2, 8.3_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties using libraries like Hypothesis (Python) or fast-check (TypeScript)
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests validate end-to-end workflows
- All tests should run with minimum 100 iterations for property-based tests
- Mock the Gemini API for unit tests; use actual API for integration tests with rate limiting
