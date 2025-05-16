import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: May, 2025</p>

      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect personal and financial information to assess your eligibility for financing. This may include:</p>
        <ul>
          <li>Full name, address, and contact details</li>
          <li>Date of birth</li>
          <li>Social Insurance Number (SIN)</li>
          <li>Employment and income information</li>
          <li>Banking details</li>
          <li>Driver’s license or other government-issued ID</li>
          <li>Vehicle or asset details</li>
        </ul>
        <p>Information is collected through our online applications or over the phone with our finance representatives.</p>
      </section>

      <section>
        <h2>2. How We Use Your Information</h2>
        <p>We only use your information to:</p>
        <ul>
          <li>Assess your credit and financing eligibility</li>
          <li>Submit your application to trusted lenders</li>
          <li>Communicate with you about your application status</li>
        </ul>
        <p>We do <strong>not</strong> use your information for marketing, remarketing, or share it with any third parties outside of our lender and dealership partners.</p>
      </section>

      <section>
        <h2>3. Sharing Your Information</h2>
        <p>Your information is only shared with:</p>
        <ul>
          <li>Financial institutions and lenders as required to process your application</li>
          <li>Partnered dealers, but only when necessary to complete your financing or purchase process</li>
        </ul>
        <p>We do <strong>not</strong> sell or rent your personal data.</p>
      </section>

      <section>
        <h2>4. Data Security</h2>
        <p>We take reasonable precautions to safeguard your information, including secure submission methods and internal access controls. However, no online or electronic system is 100% secure, and we encourage caution when sharing sensitive information.</p>
      </section>

      <section>
        <h2>5. Data Retention & Deletion</h2>
        <p>We retain your data only as long as needed to fulfill the purposes outlined above or as required by law. If you would like to inquire about your data or request deletion, please contact us.</p>
      </section>

      <section>
        <h2>6. Your Privacy Choices</h2>
        <ul>
          <li>You may request access to your personal information.</li>
          <li>You may request correction or deletion, subject to legal or regulatory requirements.</li>
          <li>You may contact us at any time with questions or concerns.</li>
        </ul>
      </section>

      <section>
        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or how your data is handled, please contact us:</p>
        <p>Email: <a href="mailto:info@nlpfinance.ca">info@nlpfinance.ca</a><br />
           Phone: (709) 489-0456</p>
      </section>
    </div>
  );
}

export default Privacy;