'use client';

import { useMetfProgram } from '@/components/metf/metf-data-access';

const SettingsPage = () => {
  const { initProgram, createBondcurve } = useMetfProgram();
  return (
    <div>
      <h1>Settings</h1>
      <div className="flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => initProgram.mutate()}
        >
          Init program
        </button>
        <button
          className="btn btn-primary"
          onClick={() => createBondcurve.mutate()}
        >
          Create the first bonding curve model
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
