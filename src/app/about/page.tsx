import Image from 'next/image';

export default function About() {
  return (
    <main className="max-w-7xl mx-auto px-ds-gutter">
      {/* Hero / Mission Section */}
      <section className="py-ds-xxl text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary font-label-md text-label-md uppercase tracking-widest mb-ds-md block">Our Purpose</span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-ds-lg">Our Mission</h1>
          <p className="font-body-lg text-body-lg text-secondary">
            We are dedicated to making healthcare accessible for everyone, everywhere. By bridging the gap between world-class medical expertise and everyday patients, we ensure that quality care is never more than a click away. Our platform is built on the belief that health information should be transparent, reliable, and easy to navigate.
          </p>
        </div>
      </section>

      {/* Vision & Goals Section */}
      <section className="py-ds-xxl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-ds-lg">
          <div className="bg-surface-container-lowest p-ds-xl rounded-xl card-shadow card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-ds-md">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">Efficiency</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Streamlining the connection between patients and providers to minimize wait times and maximize outcomes.</p>
          </div>
          <div className="bg-surface-container-lowest p-ds-xl rounded-xl card-shadow card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-ds-md">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">Trust</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Vetting every professional on our platform to ensure the highest standards of medical integrity and patient safety.</p>
          </div>
          <div className="bg-surface-container-lowest p-ds-xl rounded-xl card-shadow card-hover transition-all duration-300">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-ds-md">
              <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>universal_currency</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">Accessibility</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Breaking down geographic and financial barriers to provide equitable healthcare access for all communities.</p>
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-ds-xxl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-ds-xxl items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-tertiary-fixed rounded-xl -z-10"></div>
            <div className="rounded-xl card-shadow w-full h-[400px] overflow-hidden relative">
              <img 
                alt="Modern Medical Clinic" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB10DNKg5ngcP-QZRJYjwGbDcx73tkRw6yzzyOxDNSN9tNacZ4AAP6Kly7Xk15Ue039HBeoBCiLJCmZ9JTIeaHG_AmjrJ8SKtNbmP-9yF8pzUHtqUHRN90rv97aBOKWBkpmRY4qJM8s7mrOA8oYDslyCpkAbRoqVAqRw3QU-otq0S_zLBkO9mo3hh2LMXAmamDq33EC-eYNBcEUXkV3eEafNUSCASm8aitOi_qPiMagvAvA40WhSDaMnAC2fcR_bUAkn7REn4JOJ7g"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-fixed rounded-xl -z-10"></div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-ds-lg">Our Story</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-ds-md">
              Founded in 2020, DocRayting began as a small project in a university lab with a single goal: to solve the complex navigation of modern healthcare. We realized that while medical technology was advancing rapidly, the way patients found and interacted with doctors was stuck in the past.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Today, we serve thousands of patients daily, providing a seamless digital ecosystem that handles everything from discovery to consultation. We continue to evolve, always keeping the patient-doctor relationship at the heart of our innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-ds-xxl">
        <div className="text-center mb-ds-xl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Our Leadership</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-ds-sm">The minds driving the future of digital healthcare.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-ds-lg">
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow">
            <div className="w-full h-64 relative">
              <img 
                alt="Dr. Elena Rossi" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQZqfFwBVYF3auqJRAvOd6xZHd_ynGir9RYDfzHfcshgxbLieLcYtEMz3YT2vsLWaa3lu-BHBDUKp7nBG8MYgMmm4t_NVk-UfH4tCIR_6nmOd9xSBvaBZTDAMX9IbkTMwPqRG4-XJ7otW0aGEogikFm5JtsdoqmoB3PSy7ni0M1IH5sCRU2nttyLcZjfUhvKsiaB4SM50_nshZXtECvaF431gwa4NsCoYKyU_TS9LOv_BeqtpEZZ2yAIZgeQFWKOsKjHwTHjHJ5FM"
              />
            </div>
            <div className="p-ds-lg">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Dr. Elena Rossi</h4>
              <p className="font-label-sm text-label-sm text-primary mb-ds-md">Chief Executive Officer</p>
              <div className="flex gap-ds-sm">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow">
            <div className="w-full h-64 relative">
              <img 
                alt="Marcus Chen" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1EqLKt2TA_oTkKRcrMWT-ZcxJS9SAoQ2BGjvFGp3Pyl0rOXYX1K3-bnGezFMT9Qen-ntcv6feNTf3r3fHixzx061vMs2Tf5b5maExgoeqewhKWu1dYwEJBwMD8RgEm-VsVIaZtmOym1TB44-dYR0AXkBCqclICC5HY1hu_rh-wkMeY5g5t5poAphyW8a2bdIBf2KVrJOGXv4QrLNnijsSqv3wMQ1cP3hXuKbV-czmNFUaNR6y-5eMuaZpjHhqsul6ylY-_W4qsww"
              />
            </div>
            <div className="p-ds-lg">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Marcus Chen</h4>
              <p className="font-label-sm text-label-sm text-primary mb-ds-md">Chief Technology Officer</p>
              <div className="flex gap-ds-sm">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow">
            <div className="w-full h-64 relative">
              <img 
                alt="Dr. Sarah Jenkins" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApF5fMPGc7D_YrWTicku_WDYxvU_Ghic9sEtsY_-k8R1VuIqC6GSwtfvnChZ5Rh6bah2p1OYZ3GgC7GHHTo1RGILuHcBOo0RAs_11tndQRPAFvC6SNh_75lDe7YdE-56GzXmKFswODLuddpBOkWWm2souWpjRUgi9QM7oeMmI1qh3ZJwJ_USlmkuIMp4oNgtT5xI26DQ_oQxrbPIevnV4xqqphtZEX4ih9L7PsP1tusJL9OVYXnJlwk0npCSjx00yZ4rFxZSwqjXE"
              />
            </div>
            <div className="p-ds-lg">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Dr. Sarah Jenkins</h4>
              <p className="font-label-sm text-label-sm text-primary mb-ds-md">Medical Board Director</p>
              <div className="flex gap-ds-sm">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow">
            <div className="w-full h-64 relative">
              <img 
                alt="David Vane" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFNecCMwocJ4O5HCivyAt066iypaZs8KQ3iZ15zOtJiOyYwbUh4PP8GG9ZqyPe-VT0f0YvBD-mkaStQOGLEUagciLoX7-P1Kk8eW_XkIsuuTkFoK-dVIfOp3Ci73SCAg3lo7MakzSzRNyUbLGKCMZpzGPas9BJ3wUctB3BrUSiCYUYc-1Q3Qxb3tGf9w68A73vrncFY7cmvpNi1bbvXC9S1VxgkBNNDS1wF5C10C0Ofob8EAW-rsdhqiaFowACvwe03OgAnTWLR5Y"
              />
            </div>
            <div className="p-ds-lg">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">David Vane</h4>
              <p className="font-label-sm text-label-sm text-primary mb-ds-md">Operations Strategy</p>
              <div className="flex gap-ds-sm">
                <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
