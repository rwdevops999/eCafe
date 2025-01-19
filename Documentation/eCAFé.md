# ECAFé

A NextJS Application using React (typescript).+id)

# INSTALLATION PROBLEMS

Sometimes problems will be encountered for installing things. use the --legacy-peer-deps flags on 'npm' or 'npx'.

## creation of the application

```unix
npx create-next-app@latest
```

- project name: ecafe
- Would you like to use TypeScript? YES
- Would you like to use ESLint? YES
- Would you like to use Tailwind CSS? YES
- Would you like your code inside a `src/` directory? YES
- Would you like to use App Router? YES
- Would you like to use Turbopack for `next dev`? NO
- Would you like to customize the import alias? NO

## versions

In package.json, we see that REACT version 19 and NEXT version 15 are used.+id)

"react": "^19.0.0",
"react-dom": "^19.0.0",
"next": "15.1.0"

## Additional installations

### TailwindCSS prettier

This plugin automatically sort tailwind classes.+id)

URL: https://www.npmjs.com/package/prettier-plugin-tailwindcss/v/0.0.0-insiders.d539a72

install with:

npm i prettier-plugin-tailwindcss@0.0.0-insiders.d539a72

create a file .prettierrc with following contents:

{
"plugins": ["prettier-plugin-tailwindcss"],
"tailwindConfig": "./tailwind.config.ts",
"tailwindAttributes": ["className"],
"singleQuote": true,
"jsxSingleQuote": true
}

also a .prettierignore file should be created which includes files/folders to be ignored.

### clsx

A utility for constructing className strings.

npm i clsx

### tailwind-merge

Utility function to merge Tailwind CSS classes in JS without style conflicts

npm i tailwind-merge

create a file ./src/lib/utils.ts

and a next content to it:

import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ClassName merge
 * 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

# ShadCN

Components that you can copy and paste into your apps. The advantage is that  you can install each component into your project and you may change  the code. A file components.json will be created. Select also the style you want to use (New  York/Default) and the base color (they can be found on the shadCN website).

URL: https://ui.shadcn.com/

e.g. using Button

npx shadcn@latest add button

Would you like to use CSS variables for theming? YES

ShadCN installs the ui components under ./src/components/ui by default.

# i18next

internationalization framework

npm install i18next-browser-languagedetector react-i18next i18next --save --legacy-peer-deps

Under the root folder add a 'translations' folder containing the translation files (e.g. translationEN.json) which contains the translations like:

{
    "title": "Hello World",
    ...
}

Where the layout.tsx is (the ROOT layout), add a file i18n.ts containing:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from '../../translations/translationEN.json'

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
        escapeValue: false
    },
    resources: {
      'en': {
          translation: translationEN
        },
      }
});

export default i18n;
```

# next-themes

An abstraction for themes in a React app.

npm i next-themes --legacy-peer-deps

# zod

Zod is a TypeScript schema declaration and validation library. We use it to declare types and use it in react forms for validation.

URL: https://zod.dev/

For zod, we need to enable 'strict' mode for TS compiler. So in tsconfig.json add

{
  // ...
  "compilerOptions": {
    // ...
    "strict": true
  }
}

Then install zod using:

npm install zod

# react-hook-form

npm install react-hook-form @hookform/resolvers --legacy-peer-deps

# GIT

create for the application a git repository:

git init

All files will be send to GitHub. I use the Github Client app for this.

## tagging

for tagging the application, we use the version found in  package.json.

git tag -a v0.1.0 -m "version 0.1.0"
git push origin tag v0.1.0 

now we have the initial version of the application in github. Time to create a new branch

git checkout -b develop
git status should acknowledge that we are on the develop branch
>> On branch develop
>> nothing to commit, working tree clean

Next, update the version in package.json.

## merging

First, checkout the main branch.

```git
git checkout main
```

# eCAFé application.