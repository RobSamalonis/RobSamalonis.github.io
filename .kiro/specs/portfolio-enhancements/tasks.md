# Implementation Plan: Portfolio Enhancements

## Overview

This implementation plan breaks down the portfolio enhancements into discrete, manageable tasks. The plan follows a logical sequence: email integration, animation fixes, visual enhancements, mobile sizing, and content updates. Each task builds incrementally and includes testing to validate correctness.

## Tasks

- [x] 1. Set up email service infrastructure
  - Install @emailjs/browser package
  - Create environment variable configuration file (.env)
  - Set up EmailJS account and configure email template
  - Document EmailJS service ID, template ID, and public key in .env.example
  - _Requirements: 1.1, 1.4, 1.5_

- [x] 2. Implement email service module
  - [x] 2.1 Create src/services/emailService.ts with sendContactEmail function
    - Implement EmailData and EmailResponse interfaces
    - Implement email sending logic with EmailJS integration
    - Add error handling for network failures and configuration errors
    - _Requirements: 1.1, 1.4, 1.5_

  - [x] 2.2 Write property test for email data integrity
    - **Property 1: Email data integrity**
    - **Validates: Requirements 1.1, 1.4, 1.5**
    - Generate random valid form data
    - Verify email service receives correct recipient, form fields, and reply-to address

  - [x] 2.3 Write unit tests for email service error handling
    - Test network failure scenarios
    - Test configuration error scenarios
    - Test successful email send
    - _Requirements: 1.1_

- [x] 3. Integrate email service into Contact component
  - [x] 3.1 Update Contact.tsx to use emailService instead of mock submission
    - Import and call sendContactEmail function
    - Update handleSubmit to use real email service
    - Handle success and error responses appropriately
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.2 Write property test for success feedback display
    - **Property 2: Success feedback display**
    - **Validates: Requirements 1.2**
    - Mock successful email sends
    - Verify success message appears in DOM

  - [x] 3.3 Write property test for error state preservation
    - **Property 3: Error state preservation**
    - **Validates: Requirements 1.3**
    - Mock failed email sends
    - Verify error message displays and form data is preserved

  - [x] 3.4 Write unit tests for Contact form integration
    - Test form submission with valid data
    - Test form validation
    - Test success/error message display
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 4. Checkpoint - Test email functionality
  - Manually test email sending with real EmailJS account
  - Verify emails arrive at robsamalonis@gmail.com
  - Test error scenarios (invalid credentials, network issues)
  - Ensure all automated tests pass

- [x] 5. Fix profile picture animation for wide monitors
  - [x] 5.1 Update ProfileImage.tsx with responsive animation constraints
    - Add viewport-aware animation configuration
    - Implement max-width constraints for ultra-wide displays
    - Use percentage-based transforms instead of fixed pixels
    - Add container boundary constraints
    - _Requirements: 2.1, 2.2, 2.4_

  - [x] 5.2 Write property test for viewport-agnostic visibility
    - **Property 4: Viewport-agnostic visibility**
    - **Validates: Requirements 2.1, 2.4**
    - Test rendering at random viewport widths including >1920px
    - Verify profile picture stays within container boundaries

  - [x] 5.3 Write property test for animation boundary constraints
    - **Property 5: Animation boundary constraints**
    - **Validates: Requirements 2.2**
    - Test animations at random viewport widths
    - Verify no overflow occurs during animation

  - [x] 5.4 Write unit tests for ProfileImage responsive behavior
    - Test at specific breakpoints (320px, 768px, 1920px, 2560px)
    - Test animation initialization
    - Test reduced motion preferences
    - _Requirements: 2.1, 2.2, 2.4_

- [x] 6. Enhance hero section visual impact
  - [x] 6.1 Enhance grid animation layers in Hero.tsx
    - Increase grid opacity from 0.4 to 0.6
    - Add additional grid layers with different colors and speeds
    - Implement multi-layered grid system (perspective, isometric, wave)
    - _Requirements: 3.1, 3.2_

  - [x] 6.2 Add particle system to hero section
    - Create particle generation logic
    - Implement particle physics and animation
    - Add 30 floating particles with varied colors
    - _Requirements: 3.2_

  - [x] 6.3 Enhance geometric shapes
    - Increase shape count from 3 to 6-8
    - Add more shape varieties (triangles, hexagons, stars)
    - Implement depth layering with z-index
    - Increase glow effects and blur radius
    - _Requirements: 3.2_

  - [x] 6.4 Enhance scanline effects
    - Increase scanline opacity from 0.3 to 0.5
    - Add color cycling effect to scanlines
    - Implement multiple scanline layers at different speeds
    - _Requirements: 3.2_

  - [x] 6.5 Write property test for animation performance
    - **Property 6: Animation performance threshold**
    - **Validates: Requirements 3.3**
    - Test hero section rendering with enhanced visuals
    - Verify frame rate remains above 30 FPS

  - [x] 6.6 Write unit tests for visual elements
    - Test particle generation
    - Test geometric shape rendering
    - Test grid layer configuration
    - _Requirements: 3.2_

- [x] 7. Update mobile profile picture sizing
  - [x] 7.1 Update sizeMap in ProfileImage.tsx
    - Change mobile size from 180px to 220px
    - Update tablet size from 220px to 260px
    - Keep desktop size at 280px
    - _Requirements: 4.1, 4.2_

  - [x] 7.2 Write property test for aspect ratio preservation
    - **Property 7: Aspect ratio preservation**
    - **Validates: Requirements 4.2**
    - Test at random size configurations
    - Verify 1:1 aspect ratio is maintained

  - [x] 7.3 Write property test for mobile layout containment
    - **Property 8: Mobile layout containment**
    - **Validates: Requirements 4.3**
    - Test at random mobile viewport widths (320px-767px)
    - Verify no horizontal scrolling occurs

  - [x] 7.4 Write unit tests for mobile sizing
    - Test specific mobile breakpoints
    - Test image quality at larger sizes
    - Test layout on various mobile devices
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Implement shooting star background animation
  - [x] 8.1 Replace floating geometric shapes with shooting star system
    - Remove existing particle system and geometric shapes from Hero.tsx
    - Create shooting star generation logic with random entry/exit points
    - Implement realistic trajectory calculations for star movement
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 8.2 Create shooting star animation system
    - Implement varied star speeds (fast, medium, slow)
    - Add varied star sizes (small, medium, large)
    - Use neon color palette for star colors and trails
    - Add glowing trail effects behind each star
    - _Requirements: 5.2, 5.3_

  - [x] 8.3 Optimize shooting star performance
    - Implement star lifecycle management (creation/cleanup)
    - Limit maximum concurrent stars for performance
    - Use CSS transforms and will-change for smooth animation
    - Add reduced motion support
    - _Requirements: 5.4, 5.6_

  - [x] 8.4 Write property test for shooting star animation performance
    - **Property 9: Shooting star performance**
    - **Validates: Requirements 5.4**
    - Test hero section with shooting stars at various viewport sizes
    - Verify frame rate remains above 30 FPS with multiple stars

  - [x] 8.5 Write property test for star trajectory accuracy
    - **Property 10: Star trajectory accuracy**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random star configurations
    - Verify stars enter from off-screen and exit off-screen

  - [x] 8.6 Write unit tests for shooting star system
    - Test star generation logic
    - Test trajectory calculations
    - Test performance optimization features
    - Test reduced motion compliance
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

- [ ] 9. Checkpoint - Test responsive behavior
  - Test profile picture on mobile devices (320px-767px)
  - Test on tablets (768px-1024px)
  - Test on desktop (1024px-1920px)
  - Test on ultra-wide monitors (>1920px)
  - Verify animations work correctly at all sizes
  - Ensure all automated tests pass

- [ ] 9. Checkpoint - Test responsive behavior
  - Test profile picture on mobile devices (320px-767px)
  - Test on tablets (768px-1024px)
  - Test on desktop (1024px-1920px)
  - Test on ultra-wide monitors (>1920px)
  - Verify animations work correctly at all sizes
  - Test shooting star animations across different screen sizes
  - Ensure all automated tests pass

- [ ] 10. Update page copy and content
  - [ ] 10.1 Update hero section copy in Hero.tsx
    - Update subtitle from "Senior Software Engineer" to "Senior Software Engineer & Digital Craftsman"
    - Rewrite description to be more specific and results-oriented
    - Update button text if needed
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ] 10.2 Update contact section copy in Contact.tsx
    - Update subheading from "Ready to collaborate?" to "Have a project in mind?"
    - Review and improve other contact section text
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 10.3 Review and update resume data content
    - Review resumeData.ts for generic language
    - Update descriptions to be more specific and results-oriented
    - Ensure consistent tone across all content
    - _Requirements: 6.4, 6.5_

- [ ] 11. Final integration and testing
  - [ ] 11.1 Run full test suite
    - Execute all unit tests
    - Execute all property-based tests
    - Fix any failing tests
    - _Requirements: All_

  - [ ] 11.2 Perform manual cross-browser testing
    - Test in Chrome/Edge
    - Test in Firefox
    - Test in Safari
    - Test on mobile browsers
    - _Requirements: All_

  - [ ] 11.3 Perform manual device testing
    - Test on mobile phones (various sizes)
    - Test on tablets
    - Test on laptops
    - Test on ultra-wide monitors
    - _Requirements: 2.1, 2.2, 2.4, 4.1, 4.2, 4.3_

  - [ ] 11.4 Performance testing and optimization
    - Measure FCP, LCP, CLS metrics
    - Verify animation frame rates
    - Test email send response times
    - Test shooting star animation performance
    - Optimize if needed
    - _Requirements: 3.3, 5.4_

- [ ] 12. Final checkpoint - Production readiness
  - Verify all requirements are met
  - Ensure all tests pass
  - Confirm email service works in production
  - Get stakeholder approval on copy changes
  - Verify shooting star animations work across all devices
  - Document any known issues or limitations

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Email service requires EmailJS account setup before testing
- Content updates should be reviewed by stakeholder before finalizing
