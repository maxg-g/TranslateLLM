"use client";

import { useEffect, useRef, useState } from 'react';
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
  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("past-translations");
    if (storedData) {
      setTranslations(JSON.parse(storedData));
    }
  }, []);

  const saveTranslation = (newTranslation: any) => {
    const updatedTranslations = [newTranslation, ...translations];

    if (updatedTranslations.length > 4) {
      updatedTranslations.pop();
    }

    setTranslations(updatedTranslations);
    localStorage.setItem("past-translations", JSON.stringify(updatedTranslations));
  };

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
      .then((data) => {
        setTranslatedText(data.result.content)
        saveTranslation({
          nativeText,
          translateText: data.result.content,
          from: nativeLangSelector,
          to: foreignLangSelector,
          timestamp: new Date().toISOString()
        });
      })
      .catch((err) => { toast.error('Something went wrong'); console.log(err) });
  }

  return (
    <main className={`max-w-[1000px] m-auto pt-8 md:pt-16 font-[family-name:var(--font-geist-mono)]`}>
      <Toaster richColors />

      <div className='absolute w-full bottom-4 md:right-4 md:top-4 flex flex-col place-items-center justify-center md:justify-start md:place-items-end'>
        <span className='font-bold text-black/50'>Developed by Maximiliano García</span>
        <a className="opacity-60 underline" href="https://github.com/maxg-g/TranslateLLM" target='_blank'>Code on Github</a>
      </div>

      <header className='mb-8 md:mb-16 flex flex-col justify-center place-items-center'>
        <div className='ml-[-30px] md:ml-[-50px] flex flex-row place-items-center'>
          <Image
            src={Logo}
            width={110}
            draggable={false}
            alt="Translate symbol"
            className='mr-[-1rem]'
          />
          <h1 className="text-[40px] font-bold text-black/80">TranslateLLM</h1>
        </div>
        <p className='text-center text-lg text-black/50 text-balance md:text-nowrap'>A simple proof of concept LLM-based translation tool using OpenAI API</p>
      </header>

      <section className="flex flex-col mx-4 lg:mx-0 md:flex-row gap-2 px-2 pt-2 pb-[2px] bg-gray-100 shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl">
        <div className='w-full'>


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

          <div className="relative w-full">
            {nativeText.length > 0 && (
              <button
                onClick={clearAllText}
                className='absolute z-50 right-2 top-2 opacity-30 p-1 rounded-full hover:bg-gray-200 hover:text-black hover:opacity-60 translate-all'>
                <X />
              </button>
            )}

            <textarea
              value={nativeText}
              onChange={handleNativeText}
              className="py-4 pl-4 pr-12 text-xl w-full h-72 bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-b-xl focus:outline-none resize-none"
              placeholder={placeholderNativeText}
            />

            {nativeText.length > 0 && (
              <button
                onClick={translateText}
                className='absolute left-2 right-2 bottom-4 py-2 w-auto text-black/60 font-bold rounded-lg border border-gray-200 shadow-sm drop-shadow-sm bg-gray-100 hover:bg-white hover:text-black/60 focus:scale-95 translate-all'>
                Translate
              </button>
            )}
          </div>
        </div>

        <div className='sm:w-full md:max-w-[50%] md:min-w-[50%]'>
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

          <div className="relative w-full">
            <textarea
              readOnly
              ref={translatedTextRef}
              value={translatedText}
              onChange={handleTranslatedText}
              className="p-4 text-xl w-full h-72 bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-b-xl focus:outline-none focus:shadow-sm focus:drop-shadow-sm resize-none"
              placeholder={placeholderForeignText}
            />

            {translatedText !== "" && (
              <button
                onClick={handleCopy}
                className="absolute right-4 bottom-4 text-black/30 hover:scale-95 p-2 rounded-full hover:bg-gray-100 hover:text-black/60 transition-all">
                <Copy className='scale-90' />
              </button>
            )}
          </div>

        </div>
      </section>

      <section className='pt-16 pb-24'>
        {translations.length > 0 &&
          <>
            <h2 className='mb-8 flex justify-center text-[25px] font-bold'>Recent translations</h2>

            <ul className='mx-4 p-2 md:w-[70%] md:m-auto flex flex-col gap-2 bg-gray-100 shadow-sm drop-shadow-sm border border-gray-200 rounded-2xl'>
              {translations.map((
                { nativeText, translateText, from, to, timestamp }:
                  { nativeText: string, translateText: string, from: string, to: string, timestamp: Date }) =>
                <li key={`${timestamp}`} className='w-full h-36 flex flex-col bg-white shadow-sm drop-shadow-sm border border-gray-200 rounded-xl'>

                  <div className='py-2 h-12 w-full flex flex-row gap-4 justify-center place-items-center border-b'>
                    <p className='font-bold '>{from}</p>
                    <MoveRight className='opacity-30' />
                    <p className='font-bold '>{to}</p>
                  </div>

                  <div className='flex flex-col text-black/70'>
                    <p className='px-4 pb-4 pt-2 w-full h-full flex justify-items-center border-b-2 border-dashed border-gray-200 '>
                      {nativeText}
                    </p>
                    <p className='px-4 pb-4 pt-2 w-full h-full  '>
                      {translateText}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </>
        }
      </section>
    </main>
  );
}
