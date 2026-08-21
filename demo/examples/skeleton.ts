import { html, type TemplateResult } from 'lit'

export const skeletonExample = (): TemplateResult => html`
  <film-box>
    <h3 id="film-components-skeleton">Skeleton</h3>
    <film-cluster space="var(--s0)">
      <film-skeleton variant="circle" width="var(--s3)"></film-skeleton>
      <film-stack space="var(--s-2)" style="flex: 1;">
        <film-skeleton width="40%"></film-skeleton>
        <film-skeleton></film-skeleton>
        <film-skeleton width="80%"></film-skeleton>
      </film-stack>
    </film-cluster>
  </film-box>
`
