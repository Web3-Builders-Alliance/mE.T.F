'use client';
import useTokenList from '@/hooks/useTokenList';
import Link from 'next/link';

const TokenList = () => {
  const { data } = useTokenList();
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {data.map((token) => (
        <Link href={`/mint/${token.mint}`}>
          <div
            key={token.mint}
            className="flex items-center gap-2 p-3 rounded-lg hover:shadow-md transition-colors duration-300 hover:bg-primary/30"
          >
            <img src={token.image} alt={token.name} className="w-24 h-24" />
            <div>
              <h3>
                Created by:{' '}
                <Link
                  href={`/profile/${token.author}`}
                  className="text-indigo-500 hover:text-indigo-600 transition-colors duration-300"
                >
                  {token.author.slice(0, 10)}
                </Link>
              </h3>
              <p>{token.symbol}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TokenList;
