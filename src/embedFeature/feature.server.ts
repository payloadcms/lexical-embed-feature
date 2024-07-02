import { createServerFeature } from '@payloadcms/richtext-lexical'
import { EmbedFeatureClient } from '@/embedFeature/feature.client'
import { EmbedNode } from '@/embedFeature/nodes/EmbedNode'
import { Field, TextField } from 'payload'

const urlField: TextField = {
  name: 'url',
  type: 'text',
  required: true,
}

export const EmbedFeature = createServerFeature({
  feature: {
    ClientFeature: EmbedFeatureClient,
    nodes: [
      {
        node: EmbedNode,
      },
    ],
    generateSchemaMap: () => {
      const schemaMap = new Map<string, Field[]>()

      const fields = [urlField]
      schemaMap.set('fields', fields)

      return schemaMap
    },
  },
  key: 'embed',
})
