import { uniqueNamesGenerator, Config, names, adjectives } from 'unique-names-generator';
import faker from 'faker';
import _ from 'lodash';
import quotesy, { Quote } from 'quotesy';

export class RandomHelper{
    // Generate a random string of a given length
    static generateRandomString(length: number): string{
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generateRandomNumber(length: number): number{
        return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    }

    static generateRandomPassword(length: number = 10): string{
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
        const charactersLength = characters.length;
        let result = '';
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static getRandomFullName(): string {
        return faker.name.findName();
      }
    
      /**
       * Generates a random first name only.
       * @returns A string containing a first name
       */
      public static getRandomFirstName(): string {
        return faker.name.firstName();
      }
    
      /**
       * Generates a random last name only.
       * @returns A string containing a last name
       */
      public static getRandomLastName(): string {
        return faker.name.lastName();
      }
    
      /**
       * Generates a random name using a pattern of adjective + name.
       * For example: "Brave Alex" or "Witty Emma"
       * @returns A string containing an adjective and a name
       */
      public static getRandomCharacterName(): string {
        const config: Config = {
          dictionaries: [adjectives, names],
          separator: ' ',
          style: 'capital'
        };
        
        return uniqueNamesGenerator(config);
      }
    
      /**
       * Generates multiple random names.
       * @param count Number of names to generate
       * @param unique Whether the names should be unique
       * @returns An array of random names
       */
      public static getMultipleRandomNames(count: number, unique: boolean = true): string[] {
        const names: string[] = [];
        
        for (let i = 0; i < count; i++) {
          let name = this.getRandomFullName();
          
          // If unique is true, ensure we don't add duplicate names
          if (unique) {
            while (names.includes(name)) {
              name = this.getRandomFullName();
            }
          }
          
          names.push(name);
        }
        
        return names;
      }
    
      /**
       * Gets a random inspirational quote with a random name.
       * @returns A string containing an inspirational quote attributed to a random name
       */
      public static getRandomInspirationalQuote(): string {
        // Get an inspirational quote - filter for positive, uplifting content
        const quote = quotesy.random();
        
        // If quotesy returns a quote with an author, keep it; otherwise, use a random name
        if (!quote || !quote.text) {
          return "Believe in yourself and all that you are. - " + this.getRandomFullName();
        }
        
        const quoteText = quote.text;
        const author = quote.author || this.getRandomFullName();
        
        return `${quoteText} - ${author}`;
      }
    
      /**
       * Gets a random philosophical quote with a random name.
       * @returns A string containing a philosophical quote attributed to a random name
       */
      public static getRandomPhilosophicalQuote(): string {
        // Use quotesy to get a random quote
        const quote = quotesy.random();
        
        // If quotesy returns a quote with an author, keep it; otherwise, use a random name
        if (!quote || !quote.text) {
          return "The unexamined life is not worth living. - " + this.getRandomFullName();
        }
        
        const quoteText = quote.text;
        const author = quote.author || this.getRandomFullName();
        
        return `${quoteText} - ${author}`;
      }
    
      /**
       * Gets a random humorous quote with a random name.
       * @returns A string containing a humorous quote attributed to a random name
       */
      public static getRandomHumorousQuote(): string {
        // Use quotesy to get a random quote
        // Note: quotesy doesn't have a specific humor category, so we'll need fallbacks
        const quote = quotesy.random();
        
        // Fallback humor quotes
        const humorFallbacks = [
          "I'm on a seafood diet. I see food, and I eat it.",
          "I told my wife she was drawing her eyebrows too high. She looked surprised.",
          "I'm not arguing, I'm just explaining why I'm right.",
          "I used to be indecisive. Now I'm not so sure.",
          "Why don't scientists trust atoms? Because they make up everything!"
        ];
        
        if (!quote || !quote.text) {
          const randomHumorQuote = _.sample(humorFallbacks) || humorFallbacks[0];
          return `${randomHumorQuote} - ${this.getRandomFullName()}`;
        }
        
        const quoteText = quote.text;
        const author = quote.author || this.getRandomFullName();
        
        return `${quoteText} - ${author}`;
      }

      public static getRandomQuote(): string {
        // Use quotesy to get a truly random quote
        const quote = quotesy.random();
        
        if (!quote || !quote.text) {
          return "The best way to predict the future is to create it. - " + this.getRandomFullName();
        }
        
        const quoteText = quote.text;
        const author = quote.author || this.getRandomFullName();
        
        return `${quoteText} - ${author}`;
      }
    
      public static getMultipleRandomQuotes(count: number, unique: boolean = true): string[] {
        const quotes: string[] = [];
        
        for (let i = 0; i < count; i++) {
          let quote = this.getRandomQuote();
          
          // If unique is true, try to avoid duplicates (within reason)
          if (unique) {
            let attempts = 0;
            while (quotes.includes(quote) && attempts < 5) {
              quote = this.getRandomQuote();
              attempts++;
            }
          }
          
          quotes.push(quote);
        }
        
        return quotes;
      }
    
      public static getCustomQuoteWithName(name: string, quoteType: 'random' | 'inspirational' | 'humorous' = 'random'): string {
        // Get a quote based on the requested type
        let quote: Quote;
        switch (quoteType) {
          case 'inspirational':
            quote = quotesy.random();
            break;
          case 'humorous':
            // Use fallback humor quotes since quotesy doesn't categorize by humor
            const humorFallbacks = [
              "I'm on a seafood diet. I see food, and I eat it.",
              "I told my wife she was drawing her eyebrows too high. She looked surprised.",
              "I'm not arguing, I'm just explaining why I'm right.",
              "I used to be indecisive. Now I'm not so sure.",
              "Why don't scientists trust atoms? Because they make up everything!"
            ];
            return `${_.sample(humorFallbacks)} - ${name}`;
          case 'random':
          default:
            quote = quotesy.random();
            break;
        }
        
        if (!quote || !quote.text) {
          return "The future belongs to those who believe in the beauty of their dreams. - " + name;
        }
        
        return `${quote.text} - ${name}`;
      }
      
    
}