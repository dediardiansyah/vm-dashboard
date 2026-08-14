import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface Column {
  key: string
  type: string
  selected: boolean
}

interface GenerateOptions {
  name: string
  columns: Column[]
  apiEndpoint: string
}

export class CrudGenerator {
  private basePath: string

  constructor() {
    this.basePath = process.cwd()
  }

  private async ensureDirectoryExists(path: string) {
    if (!existsSync(path)) {
      await mkdir(path, { recursive: true })
    }
  }

  private async generateSchema(options: GenerateOptions) {
    const schemaPath = join(this.basePath, 'schemas', `${options.name}Schema.ts`)
    const schemaContent = `
import { z } from "zod"

export const create${options.name}Schema = z.object({
  ${options.columns
    .filter(col => col.selected)
    .map(col => `${col.key}: z.${col.type}()`)
    .join(',\n  ')}
})

export const update${options.name}Schema = z.object({
  ${options.columns
    .filter(col => col.selected)
    .map(col => `${col.key}: z.${col.type}().optional()`)
    .join(',\n  ')}
})

export type ICreate${options.name} = z.infer<typeof create${options.name}Schema>
export type IUpdate${options.name} = z.infer<typeof update${options.name}Schema>
`
    await this.ensureDirectoryExists(join(this.basePath, 'schemas'))
    await writeFile(schemaPath, schemaContent)
  }

  // Add more generation methods for other files...

  async generate(options: GenerateOptions) {
    await this.generateSchema(options)
    // Add calls to other generation methods...
  }
}