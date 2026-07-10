import { clearCustomerSession } from '@/lib/customerAuth';
import { apiOk, apiError } from '@/lib/apiHelpers';

// POST /api/reports/logout
export async function POST() {
  try {
    await clearCustomerSession();
    return apiOk({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('[Customer Logout Route Error]:', err);
    return apiError(err.message, 500);
  }
}
