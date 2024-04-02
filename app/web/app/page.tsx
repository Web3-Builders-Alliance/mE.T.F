import TokenList from '@/components/TokenList';
import DashboardFeature from '@/components/dashboard/dashboard-feature';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {

  return (
    <main className="isolate container min-h-full h-full">
      <div className="flex flex-col justify-center items-center space-y-5">
        <Image src={'/metf-logo.png'} width={128} height={128} alt={''} />
        <h2 className="text-4xl">
          start your personal token in seconds for $1
        </h2>
        <Link className="link" href={'/create-new-token'}>
          <button className="btn btn-primary btn-md uppercase">
            Create my token
          </button>
        </Link>
      </div>
      <div className="mt-10 flex flex-col space-y-5">
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search token" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <TokenList />
      </div>
    </main>
  );
}
