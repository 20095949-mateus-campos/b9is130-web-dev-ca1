import { FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-[var(--color-secondary)] mt-[4rem]">
      
      <div className="max-w-7xl mx-auto px-[2.5rem] py-[3rem] flex justify-between items-start">
        
        {/* LEFT */}
        <div>
          <h2 className="text-[1.8rem] font-semibold mb-[0.5rem]">
            Trackora
          </h2>
          <p className="text-[14px] opacity-80 max-w-[320px]">
            Discover and collect timeless vinyl records.
          </p>
        </div>

        {/* RIGHT */}
        <div className="text-right">
          <h3 className="font-semibold mb-[0.8rem]">Follow Us</h3>
          
          <div className="flex justify-end gap-[1.2rem] text-[20px]">
            <a href="#" className="hover:opacity-70 transition">
              <FiInstagram />
            </a>
            <a href="#" className="hover:opacity-70 transition">
              <FiTwitter />
            </a>
            <a href="#" className="hover:opacity-70 transition">
              <FiFacebook />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;