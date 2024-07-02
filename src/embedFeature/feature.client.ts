'use client'

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { EmbedNode, OPEN_EMBED_DRAWER_COMMAND } from '@/embedFeature/nodes/EmbedNode'
import { EmbedPlugin } from '@/embedFeature/plugins'
import { EmbedIcon } from '@/embedFeature/icons/EmbedIcon'

export const EmbedFeatureClient = createClientFeature({
  plugins: [
    {
      Component: EmbedPlugin,
      position: 'normal',
    },
  ],
  nodes: [EmbedNode],
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems([
        {
          key: 'embed',
          ChildComponent: EmbedIcon,
          label: 'Embed',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_EMBED_DRAWER_COMMAND, undefined)
          },
        },
      ]),
    ],
  },
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          key: 'embed',
          label: 'Embed',
          onSelect: ({ editor }) => {
            editor.dispatchCommand(OPEN_EMBED_DRAWER_COMMAND, undefined)
          },
          keywords: ['embed'],
          Icon: EmbedIcon,
        },
      ]),
    ],
  },
})
