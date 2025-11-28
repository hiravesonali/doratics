import { nanoid } from 'nanoid'

// Default header templates
export const defaultHeaders = [
  {
    id: 'simple-header-1',
    accountId: null, // Global template
    name: 'Simple Header',
    type: 'header',
    layoutJson: {
      html: `
      <div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-mx-auto pbx-text-center"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and Visuals</a></p></div> </div> </div>
      `.trim()
    },
    previewImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hero-header-1',
    accountId: null, // Global template
    name: 'Header with CTA',
    type: 'header',
    layoutJson: {
      html: `<div class="pbx-mx-auto pbx-max-w-7xl"><div class="pbx-mx-auto pbx-text-center"> <div class="pbx-break-words pbx-text-6xl lg:pbx-text-8xl pbx-font-medium"> <h2>Start customizing by editing this default text directly in the editor.</h2> </div> <div class="pbx-pt-12 pbx-pb-4"> <p>Start customizing by editing this default text directly in the editor. Start customizing by editing this default text directly in the editor.</p> </div> <div class="pbx-font-semibold pbx-py-4"><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.google.com">Layouts and Visuals</a></p></div> </div> </div>
      `.trim()
    },
    previewImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

// Default footer templates
export const defaultFooters = [
  {
    id: 'simple-footer-1',
    accountId: null, // Global template
    name: 'Simple Footer',
    type: 'footer',
    layoutJson: {
      html: `
<footer style="background: #1f2937; color: #9ca3af; padding: 3rem 0 1rem;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
      <div>
        <h3 style="color: white; margin-bottom: 1rem;">About Us</h3>
        <p style="font-size: 0.875rem;">Professional handyman services for all your home repair needs.</p>
      </div>
      <div>
        <h3 style="color: white; margin-bottom: 1rem;">Quick Links</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <a href="/services" style="color: #9ca3af; text-decoration: none; font-size: 0.875rem;">Services</a>
          <a href="/about" style="color: #9ca3af; text-decoration: none; font-size: 0.875rem;">About</a>
          <a href="/contact" style="color: #9ca3af; text-decoration: none; font-size: 0.875rem;">Contact</a>
        </div>
      </div>
      <div>
        <h3 style="color: white; margin-bottom: 1rem;">Contact</h3>
        <p style="font-size: 0.875rem;">Email: info@example.com</p>
        <p style="font-size: 0.875rem;">Phone: (555) 123-4567</p>
      </div>
    </div>
    <div style="border-top: 1px solid #374151; padding-top: 1rem; text-align: center; font-size: 0.875rem;">
      <p>&copy; 2024 Your Business. All rights reserved.</p>
    </div>
  </div>
</footer>
      `.trim()
    },
    previewImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'minimal-footer-1',
    accountId: null, // Global template
    name: 'Minimal Footer',
    type: 'footer',
    layoutJson: {
      html: `
<footer style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 2rem 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; text-align: center;">
    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">
      &copy; 2024 Your Business. All rights reserved.
    </p>
    <div style="display: flex; justify-content: center; gap: 1.5rem;">
      <a href="/privacy" style="color: #6b7280; text-decoration: none; font-size: 0.875rem;">Privacy Policy</a>
      <a href="/terms" style="color: #6b7280; text-decoration: none; font-size: 0.875rem;">Terms of Service</a>
      <a href="/contact" style="color: #6b7280; text-decoration: none; font-size: 0.875rem;">Contact</a>
    </div>
  </div>
</footer>
      `.trim()
    },
    previewImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

export const allDefaultThemes = [...defaultHeaders, ...defaultFooters]
