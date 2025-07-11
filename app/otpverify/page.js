'use client'

import { Suspense } from 'react';
import OtpVerificationPage from './OtpComponent';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationPage />
    </Suspense>
  );
}
