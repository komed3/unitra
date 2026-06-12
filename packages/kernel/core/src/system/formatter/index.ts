import type { FormatterContainer, FormatterFactoryMap } from '@unitra/types/core/formatter';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { createContainer } from '../../utils/context';
import { LaTeXFormatter } from './LaTeXFormatter';
import { PlainFormatter } from './PlainFormatter';
import { TextFormatter } from './TextFormatter';
import { UnicodeFormatter } from './UnicodeFormatter';

export const createFormatterContainer = (
  ctx: UnitraContext,
  factories?: Partial< FormatterFactoryMap >
) : FormatterContainer =>
  createContainer(
    ctx,
    {
      plain: ctx => new PlainFormatter( ctx ),
      unicode: ctx => new UnicodeFormatter( ctx ),
      latex: ctx => new LaTeXFormatter( ctx ),
      text: ctx => new TextFormatter( ctx )
    },
    factories
  );
