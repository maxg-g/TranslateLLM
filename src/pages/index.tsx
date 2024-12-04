import { useRef, useState } from 'react';
import Image from 'next/image'
import Logo from "@/media/logo.svg"
import { Toaster, toast } from 'sonner'
import { Copy, MoveRight, X } from 'lucide-react';


const nativeLanguages = [
  {
    name: "English",
    color: "red",
    flag: "🇬🇧",
    phrase: "What do you want to translate?"
  }, {
    name: "Spanish",
    color: "yellow",
    flag: "🇪🇸",
    phrase: "¿Que te gustaría traducir?"
  }
];

const foreignLanguages = [
  {
    name: "Italian",
    color: "green",
    flag: "🇮🇹",
    phrase: "Traduzione"
  }, {
    name: "German",
    color: "orange",
    flag: "🇩🇪",
    phrase: "Übersetzung"
  }, {
    name: "French",
    color: "blue",
    flag: "🇫🇷",
    phrase: "Traduction"
  }, {
    name: "Portuguese",
    color: "red",
    flag: "🇵🇹",
    phrase: "Tradução"
  }, {
    name: "Spanish",
    color: "yellow",
    flag: "🇪🇸",
    phrase: "Traducción"
  }, {
    name: "English",
    color: "red",
    flag: "🇬🇧",
    phrase: "Translation"
  },
];


export default function Home() {
  const translatedTextRef = useRef<HTMLTextAreaElement>(null);
  const [nativeText, setNativeText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [nativeLangSelector, setNativeLangSelector] = useState("");
  const [foreignLangSelector, setForeignLangSelector] = useState("");

  const handleNativeText = (e: any) => {
    setNativeText(e.target.value);
  };

  const handleTranslatedText = (e: any) => {
    setTranslatedText(e.target.value);
  };

  const clearAllText = () => {
    setNativeText('');
    setTranslatedText('')
  };

  const handleCopy = () => {
    if (translatedTextRef.current) {
      const text = translatedTextRef.current.value;
      navigator.clipboard.writeText(text)
        .then(() => text !== "" && toast.success("Successfuly copied"))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  const selectedNativeLanguage = nativeLanguages.find(
    lang => lang.name === nativeLangSelector
  );

  const placeholderNativeText = selectedNativeLanguage
    ? selectedNativeLanguage.phrase
    : "What do you want to translate?";

  const selectedForeignLanguage = foreignLanguages.find(
    lang => lang.name === foreignLangSelector
  );

  const placeholderForeignText = selectedForeignLanguage
    ? selectedForeignLanguage.phrase
    : "Translation";

  const handleNativeLangSelection = (name: string) => {
    if (foreignLangSelector === name) {
      toast.warning("Can't choose same language twice")
      return;
    }

    setNativeLangSelector(name);
  }

  const handleForeignLangSelection = (name: string) => {
    if (nativeLangSelector === name) {
      toast.warning("Can't choose same language twice")
      return;
    }

    setForeignLangSelector(name);
    setTranslatedText('')
  }

  const translateText = async () => {
    if (nativeLangSelector === "" || foreignLangSelector === "") {
      toast.info('Choose two languages')
      return;
    }

    if (nativeText === "") {
      toast.info('Try writing something first... 🤔')
      return;
    }

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: nativeLangSelector,
        to: foreignLangSelector,
        text: nativeText
      }),
    })
      .then((response) => response.json())
      .then((data) => setTranslatedText(data.result.content))
      .catch(() => toast.error('Something went wrong'));
  }

  return (
    <main className={`max-w-[1000px] m-auto mt-16 font-[family-name:var(--font-geist-mono)]`}>
      <div className="absolute inset-0 -z-50 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <Toaster richColors position="top-right" />

      <header className='ml-[-70px] mb-16 flex justify-center place-items-center'>
        <Image
          src={Logo}
          width={110}
          draggable={false}
          alt="Translate symbol"
          className='mr-[-1rem]'
        />
        <h1 className="text-[45px] font-bold">TranslateLLM</h1>
      </header>

      <section className="flex gap-2 px-2 pt-2 pb-[2px] bg-gray-100 shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl">
        <div className='w-full'>
          {nativeText.length > 0 &&
            (<button onClick={clearAllText} className='absolute z-50 left-[45%] top-[4.2rem] text-black/30 p-1 rounded-full hover:bg-gray-100 hover:text-black/60 focus:scale-95 translate-all'>
              <X />
            </button>
            )}

          <div className='px-2 w-full bg-white rounded-t-xl h-12 flex flex-row gap-2 place-items-center font-bold text-black/80 border-t border-x border-gray-200 shadow-sm drop-shadow-sm'>
            {nativeLanguages.map(({ name, color, flag }) =>
              <button
                key={name}
                onClick={() => handleNativeLangSelection(name)}
                className={`px-2 py-1 rounded-md bg-${color}-300/40 border border-${color}-400 hover:scale-95 transition-all
                ${nativeLangSelector
                    ? nativeLangSelector === name
                      ? "opacity-100"
                      : "opacity-50"
                    : "opacity-100"
                  }`}>
                {name} {flag}
              </button>
            )}
          </div>

          <textarea
            value={nativeText}
            onChange={handleNativeText}
            className="py-4 pl-4 pr-12 text-xl w-full h-72 bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-b-xl focus:outline-none resize-none"
            placeholder={placeholderNativeText}
          />
          {nativeText.length > 0 && (
            <button
              onClick={translateText}
              className='px-2.5 py-1 absolute z-50 left-[39%] bottom-4 text-black/60 font-bold rounded-lg border border-gray-200 shadow-sm drop-shadow-sm bg-gray-100 hover:bg-white hover:text-black/60 focus:scale-95 translate-all'>
              Translate
            </button>
          )}
        </div>

        <div className='max-w-[50%] min-w-[50%]'>
          <div className='px-2 w-full bg-white rounded-t-xl h-12 flex flex-row gap-2 place-items-center font-bold text-black/80 border-t border-x border-gray-200 shadow-sm drop-shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hidden'>
            {foreignLanguages.map(({ name, color, flag }) =>
              <button
                key={name}
                onClick={() => handleForeignLangSelection(name)}
                className={`px-2 py-1 rounded-md bg-${color}-300/40 border border-${color}-400 hover:scale-95 transition-all
                ${foreignLangSelector
                    ? foreignLangSelector === name
                      ? "opacity-100"
                      : "opacity-50"
                    : "opacity-100"
                  }`}>
                {name} {flag}
              </button>
            )}
          </div>

          <textarea
            readOnly
            ref={translatedTextRef}
            value={translatedText}
            onChange={handleTranslatedText}
            className="p-4 text-xl w-full h-72 bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-b-xl focus:outline-none focus:shadow-sm focus:drop-shadow-sm resize-none"
            placeholder={placeholderForeignText}
          />

          <button
            onClick={handleCopy}
            className="absolute right-6 bottom-4 text-black/30 hover:scale-95 p-2 rounded-full hover:bg-gray-100 hover:text-black/60 transition-all">
            <Copy className='scale-90' />
          </button>
        </div>
      </section>

      <section className='py-16'>
        <h2 className='mb-8 flex justify-center text-[25px] font-bold'>Recent translations</h2>

        <ul className='p-2 w-[70%] m-auto min-h-36 flex flex-col gap-2 bg-gray-100 shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl'>

          <li className='w-full h-36 flex flex-col bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-xl'>
            <div className='py-2 h-12 w-full flex flex-row gap-4 justify-center place-items-center'>
              <p className='font-bold '>🇬🇧 English</p>
              <MoveRight className='text-black/30' />
              <p className='font-bold '>Spanish 🇺🇾</p>
            </div>
            <p className='px-4 pb-4 pt-2 w-full h-full text-black/70 border-t '>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, maxime nihil repellendus cum dolorem odit eius quibusdam eum, atque nobis, veritatis dolorum laboriosam porro neque tempora ex ad fuga labore.
            </p>
          </li>

          <li className='w-full h-36 flex flex-col bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl'>
            <div className='py-2 h-12 w-full flex flex-row gap-4 justify-center place-items-center'>
              <p className='font-bold '>🇬🇧 English</p>
              <MoveRight className='text-black/30' />
              <p className='font-bold '>Spanish 🇺🇾</p>
            </div>
            <p className='px-4 pb-4 pt-2 w-full h-full text-black/70 border-t '>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, maxime nihil repellendus cum dolorem odit eius quibusdam eum, atque nobis, veritatis dolorum laboriosam porro neque tempora ex ad fuga labore.
            </p>
          </li>

          <li className='w-full h-36 flex flex-col bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl'>
            <div className='py-2 h-12 w-full flex flex-row gap-4 justify-center place-items-center'>
              <p className='font-bold '>🇬🇧 English</p>
              <MoveRight className='text-black/30' />
              <p className='font-bold '>Spanish 🇺🇾</p>
            </div>
            <p className='px-4 pb-4 pt-2 w-full h-full text-black/70 border-t '>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, maxime nihil repellendus cum dolorem odit eius quibusdam eum, atque nobis, veritatis dolorum laboriosam porro neque tempora ex ad fuga labore.
            </p>
          </li>

          <li className='w-full h-36 flex flex-col bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl'>
            <div className='py-2 h-12 w-full flex flex-row gap-4 justify-center place-items-center'>
              <p className='font-bold '>🇬🇧 English</p>
              <MoveRight className='text-black/30' />
              <p className='font-bold '>Spanish 🇺🇾</p>
            </div>
            <p className='px-4 pb-4 pt-2 w-full h-full text-black/70 border-t '>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, maxime nihil repellendus cum dolorem odit eius quibusdam eum, atque nobis, veritatis dolorum laboriosam porro neque tempora ex ad fuga labore.
            </p>
          </li>


        </ul>

      </section>

    </main>
  );
}
