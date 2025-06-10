import { useEffect, useState } from 'react';

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const loadGoogleTranslateScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'as,bn,gu,hi,kn,ks,ml,mr,ne,or,pa,sd,ta,te,ur,sa,bo,mai,brx,sat,dz,doi,mni,kok,lus,kha,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-gadget {
        color: transparent !important;
      }
      .goog-te-gadget .goog-te-combo {
        margin: 4px 0;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ddd;
        width: 100%;
        color: #333;
      }
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0px !important;
      }
      .VIpgJd-ZVi9od-l4eHX-hSRGPd, .VIpgJd-ZVi9od-ORHb {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    loadGoogleTranslateScript();

    return () => {
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) script.remove();
      if (style) style.remove();
      delete window.googleTranslateElementInit;
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 bg-[#2d457e] text-white rounded hover:bg-[#1d2f5c] transition-colors"
      >
        🌐
      </button>
      
      <div
        className={`absolute bottom-full right-0 mb-2 w-64 max-h-[300px] overflow-y-auto bg-white rounded shadow-lg border border-gray-200 ${
          isOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="p-3">
          <div id="google_translate_element"></div>
        </div>
      </div>
    </div>
  );
};

export default GoogleTranslate;