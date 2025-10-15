import React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Mail, ArrowRight, Star, Shield, Zap, Leaf, UtensilsCrossed, Home } from "lucide-react";

function cx(...cls){return cls.filter(Boolean).join(" ");}
function Button({ asChild, className = "", variant = "primary", ...props }){
  const base = "px-4 py-2 rounded-2xl text-sm font-medium shadow-sm transition hover:opacity-90 focus:outline-none focus:ring";
  const styles = variant === "secondary"
    ? "bg-white/80 text-slate-900 border border-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800"
    : "bg-emerald-600 text-white";
  const Comp = asChild ? 'span' : 'button';
  return <Comp className={cx(base, styles, className)} {...props} />;
}
function Card({ className = "", ...props }){
  return <div className={cx("rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm", className)} {...props}/>;
}
function CardHeader({ className = "", ...props }){ return <div className={cx("p-4", className)} {...props}/>; }
function CardTitle({ className = "", ...props }){ return <div className={cx("text-lg font-semibold", className)} {...props}/>; }
function CardContent({ className = "", ...props }){ return <div className={cx("p-4", className)} {...props}/>; }
function Input({ className = "", ...props }){ return <input className={cx("h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950", className)} {...props}/>; }
function Textarea({ className = "", ...props }){ return <textarea className={cx("px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950", className)} {...props}/>; }
function Switch({ checked, onCheckedChange, ...props }){
  return (
    <button aria-pressed={checked} onClick={() => onCheckedChange(!checked)} className={cx("h-6 w-11 rounded-full p-0.5 transition", checked ? "bg-emerald-500" : "bg-slate-300")} {...props}>
      <span className={cx("block h-5 w-5 rounded-full bg-white transition", checked ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

// Helpers
function formToJSON(form) {
  const data = new FormData(form);
  const obj = {};
  for (const [k, v] of data.entries()) {
    if (k in obj) {
      if (Array.isArray(obj[k])) obj[k].push(v);
      else obj[k] = [obj[k], v];
    } else obj[k] = v;
  }
  return obj;
}

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: (i=0)=>({ opacity:1, y:0, transition:{delay:0.05*i, duration:0.5}})};
const Section = ({ id, className = "", children }) => ( <section id={id} className={`w-full max-w-6xl mx-auto px-4 md:px-6 ${className}`}>{children}</section> );

// Config
const CONFIG = {
  brand: "The Local Guys' Organics",
  tagline: "Ultra-fresh, pesticide-free organic vegetables — grown locally with terraponics for homes & restaurants.",
  contact: { enabled: true, formspreeId: "" }, // add your Formspree ID to enable
  social: { instagram: "#", facebook: "#" },
  forms: { orderWebhook: "" }, // paste your Zapier/Make webhook here for Google Sheets
};

export default function App(){
  const [dark, setDark] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);
  const [customerType, setCustomerType] = React.useState("");

  // Thank You gating
  const [showThanks, setShowThanks] = React.useState(() => (typeof window !== 'undefined' && window.location.hash === '#thank-you' && sessionStorage.getItem('orderSubmitted') === '1'));
  React.useEffect(() => {
    const check = () => {
      const ok = window.location.hash === '#thank-you' && sessionStorage.getItem('orderSubmitted') === '1';
      setShowThanks(ok);
      if (window.location.hash === '#thank-you' && !ok) {
        window.location.hash = '#home';
      }
    };
    check();
    const onHash = () => check();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  React.useEffect(()=>{
    if(dark) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark");
  }, [dark]);

  const Toast = ({children}) => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-emerald-600 text-white px-4 py-2 shadow-lg">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Toast */}
      {showToast && <Toast>✅ Sent!</Toast>}

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
        <Section className="flex items-center justify-between py-3">
          <a href="#home" className="inline-flex items-center gap-2 font-semibold" aria-label="Go to home">
            <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-600 grid place-items-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>{CONFIG.brand}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main">
            <a href="#about" className="hover:opacity-80">About</a>
            <a href="#benefits" className="hover:opacity-80">Benefits</a>
            <a href="#for" className="hover:opacity-80">Who we serve</a>
            <a href="#faq" className="hover:opacity-80">FAQ</a>
            <a href="#order" className="hover:opacity-80">Order</a>
            <a href="#contact" className="hover:opacity-80">Contact</a>
            <a href="#cta"><Button className="inline-flex gap-2">Get produce <ArrowRight className="h-4 w-4"/></Button></a>
          </nav>
          <div className="flex items-center gap-2 text-xs">
            <span className="opacity-70">Light</span>
            <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
            <span className="opacity-70">Dark</span>
          </div>
        </Section>
      </header>

      {/* Hero */}
      <Section id="home" className="pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Fresh picked. Pure flavor.
              <span className="block bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">Organic vegetables, grown locally</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl opacity-80 max-w-prose">
              Terraponic growing lets us harvest at peak flavor — no pesticides, no long-haul trucking, just clean, nutrient-dense produce.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact"><Button className="inline-flex gap-2">Get in touch <Zap className="h-4 w-4"/></Button></a>
              <Button variant="secondary" className="inline-flex gap-2" asChild><a href="#benefits">Why it tastes better</a></Button>
            </div>
            <ul className="mt-6 space-y-2 text-sm opacity-80">
              {[
                "Zero pesticides or chemical residues",
                "Harvested same-day for maximum freshness",
                "Packed with crisp texture and vibrant flavor",
              ].map((txt, i) => (<li key={i} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5"/>{txt}</li>))}
            </ul>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" custom={1} viewport={{ once: true }}>
            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200/60 dark:ring-slate-800">
              <img src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1600&auto=format&fit=crop" alt="Farmers market display of fresh organic vegetables" className="w-full h-80 object-cover"/>
              <div className="absolute bottom-3 right-3">
                <Card className="backdrop-blur bg-white/70 dark:bg-slate-900/60">
                  <CardContent className="p-3 text-xs">
                    <div className="flex items-center gap-2"><Leaf className="h-4 w-4"/>Pesticide‑free</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Benefits */}
      <Section id="benefits" className="py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Why our vegetables taste better</h2>
          <p className="mt-3 opacity-80">Terraponic systems nurture living biology — delivering clean, nutrient‑dense produce without pesticides.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { stat: "Ultra‑fresh", label: "Harvested at peak flavor" },
            { stat: "Pesticide‑free", label: "No chemical residues" },
            { stat: "Nutrient‑dense", label: "Grown in living media" },
            { stat: "Local & sustainable", label: "Short supply chain" },
          ].map((b, i) => (
            <Card key={i}>
              <CardHeader><CardTitle className="text-base">{b.stat}</CardTitle></CardHeader>
              <CardContent className="opacity-80 text-sm">{b.label}</CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Who we serve */}
      <Section id="for" className="py-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Home className="h-5 w-5"/> Households</CardTitle></CardHeader>
            <CardContent className="opacity-80 text-sm">
              Weekly shares of vegetables and herbs — picked fresh and delivered locally. Cleaner, crisper produce for your family.
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UtensilsCrossed className="h-5 w-5"/> Restaurants</CardTitle></CardHeader>
            <CardContent className="opacity-80 text-sm">
              Consistent, high‑quality vegetables with bright flavor and excellent plate life. Direct relationships, reliable schedules, local delivery.
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* About */}
      <Section id="about" className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">About The Local Guys' Organics</h2>
          <p className="mt-4 opacity-80 text-lg">
            We grow food the way nature intended — clean, organic, and bursting with flavor. Using terraponic growing systems, we harvest locally so you get produce at its peak.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">FAQ</h2>
          <div className="mt-8 space-y-6">
            {[
              { q: "What is terraponics?", a: "A growing method using a soil‑like medium and gentle irrigation. It supports vibrant plant health, great flavor, and clean, pesticide‑free production." },
              { q: "Is everything organic?", a: "Yes — we follow organic practices and do not use pesticides or chemical sprays." },
              { q: "Do you deliver locally?", a: "Yes — we focus on nearby homes and restaurants to keep everything ultra‑fresh." },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader><CardTitle className="text-base">{item.q}</CardTitle></CardHeader>
                <CardContent className="opacity-80 text-sm">{item.a}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="cta" className="py-16">
        <div className="bg-gradient-to-br from-emerald-600 to-lime-600 rounded-3xl p-8 md:p-12 text-white shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold">Ready for ultra‑fresh vegetables?</h3>
              <p className="mt-2 text-white/90">Tell us if you’re a household or a restaurant and we’ll follow up with details.</p>
            </div>
            <div className="flex gap-3 justify-start md:justify-end">
              <a href="#contact"><Button className="inline-flex gap-2">Contact us <Mail className="h-4 w-4"/></Button></a>
            </div>
          </div>
        </div>
      </Section>

      {/* Order Interest */}
      <Section id="order" className="py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Order Interest</h2>
          <p className="mt-2 opacity-80">
            Tell us what vegetables you’re interested in. We’ll reply with availability and timing.
          </p>

          <Card className="mt-6">
            <CardContent>
              {CONFIG.contact.enabled ? (
                <form
                  aria-label="Order interest form"
                  className="grid gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;

                    // Honeypot (anti-spam): if filled, ignore submission
                    if (form.website && form.website.value) return;

                    const payload = formToJSON(form);
                    try {
                      if (CONFIG.forms?.orderWebhook) {
                        await fetch(CONFIG.forms.orderWebhook, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                      } else if (CONFIG.contact?.formspreeId) {
                        await fetch(`https://formspree.io/f/${CONFIG.contact.formspreeId}`, {
                          method: "POST",
                          headers: { Accept: "application/json" },
                          body: new FormData(form),
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }

                    // Toast + gated Thank You
                    setShowToast(true);
                    setTimeout(() => {
                      sessionStorage.setItem("orderSubmitted", "1");
                      window.location.hash = "#thank-you";
                    }, 900);
                  }}
                >
                  {/* Honeypot (leave empty) */}
                  <input
                    type="text"
                    name="website"
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* Customer type */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">I am a</label>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="customer_type"
                          value="Household"
                          required
                          onChange={() => setCustomerType("Household")}
                        />
                        <span>Household</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="customer_type"
                          value="Restaurant"
                          required
                          onChange={() => setCustomerType("Restaurant")}
                        />
                        <span>Restaurant</span>
                      </label>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid gap-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input name="name" placeholder="Name" required />
                      {customerType === "Restaurant" && (
                        <Input name="business" placeholder="Business (restaurant name)" required />
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input name="location" placeholder="City / Neighborhood" required />
                      <Input name="phone" type="tel" placeholder="Phone" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input name="email" type="email" placeholder="Email" required />
                      <div />
                    </div>
                  </div>

                  {/* Items of interest */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Vegetables of interest</label>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Salad mix" /> <span>Salad mix</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Tomatoes" /> <span>Tomatoes</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Cucumbers" /> <span>Cucumbers</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Peppers" /> <span>Peppers</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Herbs" /> <span>Herbs</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" name="items" value="Root vegetables" /> <span>Root vegetables</span>
                      </label>
                    </div>
                  </div>

                  {/* Preferences (Delivery only for Households) */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {customerType === "Household" and (
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Delivery preference</label>
                        <select
                          name="delivery"
                          className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                        >
                          <option value="Local delivery">Local delivery</option>
                          <option value="Pickup">Pickup</option>
                          <option value="Either">Either</option>
                        </select>
                      </div>
                    )}

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Preferred day</label>
                      <select
                        name="preferred_day"
                        className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                      >
                        <option>Any</option>
                        <option>Mon</option>
                        <option>Tue</option>
                        <option>Wed</option>
                        <option>Thu</option>
                        <option>Fri</option>
                        <option>Sat</option>
                        <option>Sun</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes */}
                  <Textarea
                    name="message"
                    placeholder="Quantities, special requests, restaurant specs, or delivery address"
                    rows={5}
                  />

                  <Button type="submit" className="inline-flex gap-2">
                    Send interest <Mail className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <div className="opacity-80">Add a Formspree ID in CONFIG.contact to enable the form.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" className="py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Contact</h2>
            <p className="mt-2 opacity-80">Share your needs (household shares or restaurant supply), and where you’re located.</p>
            <div className="flex gap-4 mt-4 text-sm">
              <a className="opacity-80 hover:opacity-100 underline" href={CONFIG.social.facebook}>Facebook</a>
              <a className="opacity-80 hover:opacity-100 underline" href={CONFIG.social.instagram}>Instagram</a>
            </div>
          </div>
          {CONFIG.contact.enabled ? (
            <form method="POST" action={`https://formspree.io/f/${CONFIG.contact.formspreeId}`} className="grid gap-3" aria-label="Contact form">
              <Input name="name" placeholder="Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Textarea name="message" placeholder="Tell us if you're a household or restaurant, and what you need" rows={5} />
              <Button type="submit" className="inline-flex gap-2">Send message <Mail className="h-4 w-4"/></Button>
            </form>
          ) : (
            <div className="opacity-80">Add a Formspree ID in CONFIG.contact to enable the form.</div>
          )}
        </div>
      </Section>

      {/* Thank You */}
      {showThanks && (
        <Section id="thank-you" className="py-24">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Thank you!</h2>
            <p className="mt-3 opacity-80">We received your request. We’ll be in touch shortly with availability and next steps.</p>
            <div className="mt-6">
              <a href="#home" onClick={() => { sessionStorage.removeItem('orderSubmitted'); }}><Button className="inline-flex gap-2">Back to Home</Button></a>
            </div>
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 mt-16">
        <Section className="py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="opacity-70">© {new Date().getFullYear()} {CONFIG.brand}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#about" className="opacity-80 hover:opacity-100">About</a>
            <a href="#benefits" className="opacity-80 hover:opacity-100">Benefits</a>
            <a href="#for" className="opacity-80 hover:opacity-100">Who we serve</a>
            <a href="#faq" className="opacity-80 hover:opacity-100">FAQ</a>
            <a href="#contact" className="opacity-80 hover:opacity-100">Contact</a>
          </div>
        </Section>
      </footer>
    </div>
  );
}

