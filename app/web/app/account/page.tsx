// import AccountListFeature from '@/components/account/account-list-feature';

// export default function Page() {
//   return <AccountListFeature />;
// }

import AccountForm from './account-form'
import { createClient } from 'utils/supabase/server'

export default async function Account() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}
