import { ErrorState } from '../components/common/ErrorState';

export function NotFoundPage() {
  return (
    <div id="not-found-page">
      <ErrorState type="404" fullScreen />
    </div>
  );
}
