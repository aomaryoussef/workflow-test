import { UnknownObject } from 'express-handlebars/types';
import { UiNode, UiNodeInputAttributes } from '@ory/client';
import {
  filterNodesByGroups,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  isUiNodeTextAttributes,
} from '@ory/integrations/ui';
import {
  ButtonLink,
  Divider,
  MenuLink,
  Typography,
} from '@ory/elements-markup';

export const handlebarsHelpers: UnknownObject = {
  jsonPretty: (context: any) => JSON.stringify(context, null, 2),
  toUiNodePartial: (node: UiNode) => {
    if (isUiNodeAnchorAttributes(node.attributes)) {
      return 'ui_node_anchor';
    } else if (isUiNodeImageAttributes(node.attributes)) {
      return 'ui_node_image';
    } else if (isUiNodeInputAttributes(node.attributes)) {
      switch (node.attributes && node.attributes.type) {
        case 'hidden':
          return 'ui_node_input_hidden';
        case 'submit':
          const attrs = node.attributes as UiNodeInputAttributes;
          const isSocial =
            (attrs.name === 'provider' || attrs.name === 'link') &&
            node.group === 'oidc';

          return isSocial
            ? 'ui_node_input_social_button'
            : 'ui_node_input_button';
        case 'button':
          return 'ui_node_input_button';
        case 'checkbox':
          return 'ui_node_input_checkbox';
        default:
          return 'ui_node_input_default';
      }
    } else if (isUiNodeScriptAttributes(node.attributes)) {
      return 'ui_node_script';
    } else if (isUiNodeTextAttributes(node.attributes)) {
      return 'ui_node_text';
    }
    return 'ui_node_input_default';
  },
  onlyNodes: (
    nodes: Array<UiNode>,
    groups: string,
    attributes: string,
    withoutDefaultGroup?: boolean,
    withoutDefaultAttributes?: boolean,
  ) =>
    filterNodesByGroups({
      groups: groups,
      attributes: attributes,
      nodes: nodes,
      withoutDefaultAttributes,
      withoutDefaultGroup,
    }),
  divider: (fullWidth: boolean, className?: string) =>
    Divider({ className, fullWidth }),
  buttonLink: (text: string) =>
    ButtonLink({ href: 'https://www.ory.sh/', children: text }),
  typography: (text: string, size: any, color: any, type?: any) =>
    Typography({
      children: text,
      type: type || 'regular',
      size,
      color,
    }),
  menuLink: (
    text: string,
    url: string,
    iconLeft?: string,
    iconRight?: string,
  ) => {
    return MenuLink({
      href: url,
      iconLeft: iconLeft,
      iconRight: iconRight,
      children: text,
    });
  },
  oryBranding: () =>
    Typography({
      children: `Protected by `,
      type: 'regular',
      size: 'tiny',
      color: 'foregroundSubtle',
    }),
};
