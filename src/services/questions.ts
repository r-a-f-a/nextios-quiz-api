import questionsTemplate from '../templates/questionsTemplate.json'

export interface Questions {
  compare: Compare;
}

export interface Compare {
  (question: number, response: string): boolean;
}

export interface Template {
  [index: number]: object|Array<string>|Array<object>;
}

export default function Questions(): Questions {
  const template: Template = questionsTemplate;

  let compare: Compare;
  compare = function (question: number, response: string): boolean {
    return response === JSON.stringify(template[question]);
  }

  return {
    compare
  }
}