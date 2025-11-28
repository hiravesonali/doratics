import { nanoid } from 'nanoid'

// Default header templates
export const defaultHeaders = [
  {
    id: 'simple-header-1',
    name: 'Simple Header',
    type: 'header',
    layoutJson: {
      html: `
<header style="background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 1rem 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">Your Logo</div>
    <nav style="display: flex; gap: 2rem;">
      <a href="/" style="color: #4b5563; text-decoration: none;">Home</a>
      <a href="/about" style="color: #4b5563; text-decoration: none;">About</a>
      <a href="/services" style="color: #4b5563; text-decoration: none;">Services</a>
      <a href="/contact" style="color: #4b5563; text-decoration: none;">Contact</a>
    </nav>
  </div>
</header>
      `.trim()
    },
    previewImageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hero-header-1',
    name: 'Header with CTA',
    type: 'header',
    layoutJson: {
      html: `
<header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 0;">
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-size: 1.5rem; font-weight: bold;">Your Business</div>
    <nav style="display: flex; gap: 2rem; align-items: center;">
      <a href="/" style="color: white; text-decoration: none;">Home</a>
      <a href="/services" style="color: white; text-decoration: none;">Services</a>
      <a href="/contact" style="background: white; color: #667eea; padding: 0.5rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Get Quote</a>
    </nav>
  </div>
</header>
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
