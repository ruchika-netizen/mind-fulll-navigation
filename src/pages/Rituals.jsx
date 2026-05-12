import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ArrowLeft, Check, Loader2, CreditCard } from "lucide-react";
import pikaSmile from "../assets/pexels-regan-dsouza-1315522347-30990826.jpg";
import bellSound from "../assets/universfield-clear-bell-chime-487898.mp3";

const JourneyEnd = () => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState("");
  const [status, setStatus] = useState("idle");
  const [sendSeedCard, setSendSeedCard] = useState(false); // Checkbox state
  const [showFinalOption, setShowFinalOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const bellRef = useRef(new Audio(bellSound));

  const handlePlant = async () => {
    if (!intention.trim()) return;
    setStatus("planting");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("rituals").insert([{
          user_id: user.id,
          intention: intention,
          seed_card_requested: sendSeedCard
        }]);
      }
    } catch (e) {
      console.error("Error:", e.message);
    }

    setTimeout(() => {
      if (bellRef.current) bellRef.current.play().catch(() => { });
      setStatus("completed");
      setLoading(false);
      setTimeout(() => setShowFinalOption(true), 2000);
    }, 7000);
  };

  const handlePaymentSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/payment-success");
    }, 3000);
  };

  const handlePayment = () => {
    if (!sendSeedCard) return;

    setIsProcessing(true);

    // Aapka live Stripe test payment link
    const STRIPE_LINK = "https://buy.stripe.com/test_8x228kaS43eofS5aog7AI00";

    // User ko Stripe checkout page par redirect karna
    window.location.href = STRIPE_LINK;
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#36454F] font-serif flex items-center justify-center p-4 md:p-5 overflow-hidden selection:bg-[#36454F]/10">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch bg-white/40 rounded-[3.5rem] p-8 md:p-10 border border-white/60 shadow-2xl relative transition-all duration-[1500ms]">

        {/* LEFT SIDE */}
        <div className={`flex flex-col justify-between transition-all duration-[2000ms] ${status === 'completed' ? 'opacity-0 blur-sm pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-10">
            <div className="space-y-5 text-md md:text-2xl font-light italic leading-relaxed opacity-80">
              <p>When the day feels long and the path feels uncertain, offer a smile to the next person you meet.</p>
              <p>Not because they deserve it.</p>
              <p> Not because you have it to spare.</p>
              <p>But because in that single moment, you will both be a little less alone.</p>
            </div>
            <p className="text-[16px] uppercase font-sans font-bold">This is the way of the Mindful Navigator.</p>
          </div>
          <div className="pt-16 flex flex-col items-start gap-8">
            <img src={pikaSmile} alt="Companion" className="w-24 h-auto grayscale opacity-40 rounded-xl" />
            <button onClick={() => navigate("/")} className="flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] font-sans font-bold hover:opacity-100 transition-all">
              <ArrowLeft size={12} /> Back to Home
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={`flex flex-col items-center justify-center text-center transition-all duration-[1500ms] ${status === 'completed' ? 'md:translate-x-[-50%] w-full' : ''}`}>
          <div className={`w-full relative min-h-[600px] flex flex-col items-center transition-all duration-1000 ${status === 'completed' ? 'justify-center' : 'justify-start pt-6'}`}>

            {/* ENSO CIRCLE */}
            <div className={`relative flex items-center justify-center transition-all duration-[2000ms] ${status === 'completed' ? 'w-48 h-48 md:w-64 md:h-64 mb-12 scale-110' : 'w-40 h-40 md:w-56 md:h-56 mb-10'}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#36454F" strokeWidth="1" opacity="0.1" />
                <circle
                  cx="50" cy="50" r="48"
                  fill="none" stroke="#36454F" strokeWidth="1"
                  strokeLinecap="round"
                  strokeDasharray="301.6"
                  strokeDashoffset={status === "idle" ? "301.6" : "0"}
                  className={`transition-all duration-[5000ms] ${status === "idle" ? "opacity-10" : "opacity-100"}`}
                />
              </svg>
            </div>

            {/* CONTENT */}
            <div className="w-full flex flex-col items-center">
              {status === "idle" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-sm">
                  <div className="space-y-4">
                    <h3 className="text-[16px] uppercase font-sans font-bold">The Closing Ritual</h3>
                    <p className="text-xl font-light italic">Write one intention you are ready to plant in the world.</p>
                  </div>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="Whatever arrives..."
                    className="w-full bg-transparent border-b border-[#36454F] text-center text-xl italic py-4 outline-none h-20 resize-none"
                  />
                  <button
                    onClick={handlePlant}
                    disabled={!intention.trim() || loading}
                    className={`w-full py-5 rounded-full text-[12px] uppercase font-sans font-bold transition-all ${intention.trim() ? "bg-[#36454F] text-white shadow-xl" : "opacity-10 cursor-not-allowed"}`}
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Plant It"}
                  </button>
                </div>
              )}

              {status === "planting" && (
                <div className="space-y-8">
                  <p className="text-3xl italic font-light opacity-60 italic">"{intention}"</p>
                  <p className="text-[13px] uppercase tracking-[0.2em] animate-pulse font-sans">Returning to the earth</p>
                </div>
              )}

              {status === "completed" && (
                <div className="flex flex-col items-center space-y-10 animate-in fade-in zoom-in-95 duration-[2500ms]">
                  <div className="space-y-6">
                    <h3 className="text-5xl md:text-6xl font-light italic text-[#36454F]">It is planted.</h3>
                    <p className="text-xl font-light italic">Go in peace.</p>
                  </div>

                  {showFinalOption && (
                    <div className="animate-in slide-in-from-bottom-12 fade-in duration-[1500ms] bg-[#F5F0E8]/70 rounded-[2rem] p-5 border border-white/50 shadow-xl space-y-5 max-w-lg">
                      <p className="text-[15px] font-serif italic text-[#36454F]/80 leading-relaxed">
                        "If you would like to hold this moment in your hands — check the box below and we will send you a seed card by post. Plant it. Let it grow."
                      </p>

                      <div className="space-y-4">
                        {/* CHECKBOX SECTION */}
                        <label className="flex items-center justify-center gap-3 cursor-pointer group py-2">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={sendSeedCard}
                              onChange={(e) => setSendSeedCard(e.target.checked)}
                              className="peer appearance-none w-6 h-6 border-2 border-[#36454F]/20 rounded-md checked:bg-[#36454F] checked:border-[#36454F] transition-all"
                            />
                            <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} strokeWidth={4} />
                          </div>
                          <span className="text-[13px] uppercase tracking-widest font-sans font-bold opacity-70 group-hover:opacity-100 transition-opacity">
                            Please send me a seed card — $6 CAD plus postage
                          </span>
                        </label>

                        {/* PAYMENT BUTTON */}
                        <button
                          onClick={handlePayment} // Simulation ki jagah real function
                          disabled={isProcessing || !sendSeedCard}
                          className={`w-full flex items-center justify-between gap-5 p-6 rounded-2xl transition-all group ${sendSeedCard
                              ? "bg-white border-2 border-[#36454F] shadow-md hover:shadow-lg active:scale-[0.98]"
                              : "bg-white/50 border-2 border-[#36454F]/5 opacity-40 cursor-not-allowed"
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${sendSeedCard ? "bg-[#36454F] text-white" : "bg-[#36454F]/10 text-[#36454F]/30"
                              }`}>
                              {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                            </div>
                            <div className="text-left">
                              <span className="text-[11px] uppercase tracking-widest font-sans font-bold block text-[#36454F]">
                                Secure Checkout
                              </span>
                              <span className="text-sm italic opacity-60 text-[#36454F]">
                                {isProcessing ? "Redirecting to Stripe..." : "Proceed to Payment"}
                              </span>
                            </div>
                          </div>
                          <ArrowLeft size={16} className={`rotate-180 transition-all ${sendSeedCard ? "opacity-100 translate-x-0 group-hover:translate-x-2" : "opacity-0"
                            }`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyEnd;