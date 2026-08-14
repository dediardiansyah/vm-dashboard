import { NodePlopAPI } from 'plop';
import { readdirSync } from 'fs';
import path from 'path';

export default function (plop: NodePlopAPI) {
  // Helpers
  plop.setHelper('pascalCase', (text: string) => {
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
  });

  plop.setHelper('camelCase', (text) => {
    return text.charAt(0).toLowerCase() + text.slice(1);
  });

  plop.setHelper('constantCase', (text) => {
    return text.toUpperCase().replace(/-/g, '_');
  });

  plop.setHelper('parseFields', (fieldsStr: string) => {
    return fieldsStr.split(',').map((field: string) => {
      const [name, type] = field.trim().split(':');
      return { name, type };
    });
  });

  plop.setHelper('hasField', (fieldsStr: string, fieldName: string) => {
    const fields = fieldsStr.split(',').map((field: string) => {
      const [name, type] = field.trim().split(':');
      return { name, type };
    });
    return fields.some(field => field.name === fieldName);
  });

  plop.setHelper('startCase', (text: string) => {
    return text
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  });

  // Add singular helper
  plop.setHelper('singular', (text: string) => {
    // Basic rules for converting plural to singular
    if (text.endsWith('ies')) {
      return text.slice(0, -3) + 'y';
    }
    if (text.endsWith('s') && !text.endsWith('ss')) {
      return text.slice(0, -1);
    }
    return text;
  });

  // CRUD Generator
  plop.setGenerator('crud', {
    description: 'Create CRUD module',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name (in kebab-case, e.g., blog-posts):',
        validate: (value: string) => {
          if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
            return true;
          }
          return 'Please enter a valid kebab-case name';
        }
      },
      {
        type: 'input',
        name: 'fields',
        message: 'Enter fields (comma separated, e.g., title:string,content:text,published:boolean):',
        validate: (value: string) => {
          if (value.length < 1) {
            return 'Fields are required';
          }
          return true;
        }
      }
    ],
    actions: [
      // Schema
      {
        type: 'add',
        path: 'schemas/{{name}}Schema.ts',
        templateFile: 'templates/schema.hbs'
      },
      // Types
      {
        type: 'add',
        path: 'types/{{name}}.ts',
        templateFile: 'templates/types.hbs'
      },
      // API Routes
      {
        type: 'add',
        path: 'app/api/admin/{{name}}/route.ts',
        templateFile: 'templates/api-route.hbs'
      },
      {
        type: 'add',
        path: 'app/api/admin/{{name}}/[id]/route.ts',
        templateFile: 'templates/api-route-id.hbs'
      },
      // React Components
      {
        type: 'add',
        path: 'app/admin/(dashboard)/{{name}}/page.tsx',
        templateFile: 'templates/admin/page.hbs'
      },
      {
        type: 'add',
        path: 'app/admin/(dashboard)/{{name}}/columns.tsx',
        templateFile: 'templates/admin/columns.hbs'
      },
      {
        type: 'add',
        path: 'app/admin/(dashboard)/{{name}}/add-{{name}}-dialog.tsx',
        templateFile: 'templates/admin/add-dialog.hbs'
      },
      {
        type: 'add',
        path: 'app/admin/(dashboard)/{{name}}/edit-{{name}}-dialog.tsx',
        templateFile: 'templates/admin/edit-dialog.hbs'
      },
      // // Hook
      // {
      //   type: 'add',
      //   path: 'hooks/use-{{name}}.ts',
      //   templateFile: 'templates/hook.hbs'
      // },
      // Update schema.prisma
      // {
      //   type: 'modify',
      //   path: 'prisma/schema.prisma',
      //   pattern: /(model User {[\s\S]*?})/,
      //   template: '$1\n\nmodel {{pascalCase name}} {\n  id        Int      @id @default(autoincrement())\n{{#each fields}}\n  {{name}}  {{type}}\n{{/each}}\n}'
      // }
    ]
  });
}