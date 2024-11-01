'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext.js'
import { $insertNodeToNearestRoot, mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  RangeSelection,
} from 'lexical'
import { useEffect, useState } from 'react'
import { PluginComponent } from '@payloadcms/richtext-lexical'
import {
  $createEmbedNode,
  EmbedNode,
  EmbedNodeData,
  INSERT_EMBED_COMMAND,
  OPEN_EMBED_DRAWER_COMMAND,
} from '@/embedFeature/nodes/EmbedNode'
import { FieldsDrawer } from '@payloadcms/richtext-lexical/client'
import { useModal } from '@payloadcms/ui'

const drawerSlug = 'lexical-embed-create'

export const EmbedPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()
  const { closeModal, toggleModal } = useModal()
  const [lastSelection, setLastSelection] = useState<RangeSelection | null>(null)
  const [embedData, setEmbedData] = useState<EmbedNodeData | {}>({})
  const [targetNodeKey, setTargetNodeKey] = useState<string | null>(null)

  useEffect(() => {
    const ensureValidSelection = () => {
      let selection = $getSelection()
      if ($isRangeSelection(selection)) {
        return selection
      } else if ($isRangeSelection(lastSelection)) {
        return lastSelection
      }
      console.error('No valid range selection found')
      return null
    }

    const insertEmbedCommand = editor.registerCommand(
      INSERT_EMBED_COMMAND,
      ({ url }) => {
        if (targetNodeKey !== null) {
          const node: EmbedNode = $getNodeByKey(targetNodeKey) as EmbedNode
          if (!node) {
            console.error('Target node not found', targetNodeKey)
            return false
          }
          node.setData({ url })
          setTargetNodeKey(null)
          return true
        }

        const selection = ensureValidSelection()
        if (!selection) return false

        const focusNode = selection.focus.getNode()
        if (!focusNode) {
          console.error('Focus node not found from selection', selection)
          return false
        }

        const horizontalRuleNode = $createEmbedNode({ url })
        $insertNodeToNearestRoot(horizontalRuleNode)

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    const openEmbedDrawerCommand = editor.registerCommand(
      OPEN_EMBED_DRAWER_COMMAND,
      (embedData) => {
        setEmbedData(embedData?.data ?? {})
        setTargetNodeKey(embedData?.nodeKey ?? null)

        if (embedData?.nodeKey) {
          toggleModal(drawerSlug)
          return true
        }

        const selection = ensureValidSelection()
        if (selection) {
          setLastSelection(selection)
          toggleModal(drawerSlug)
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    return () => {
      insertEmbedCommand()
      openEmbedDrawerCommand()
    }
  }, [editor, lastSelection, targetNodeKey, toggleModal])

  return (
    <FieldsDrawer
      data={embedData}
      drawerSlug={drawerSlug}
      drawerTitle={'Create Embed'}
      featureKey="embed"
      handleDrawerSubmit={(_fields, data) => {
        closeModal(drawerSlug)
        if (!data.url) {
          return
        }

        editor.dispatchCommand(INSERT_EMBED_COMMAND, {
          url: data.url as string,
        })
      }}
      schemaPathSuffix="fields"
    />
  )
}
