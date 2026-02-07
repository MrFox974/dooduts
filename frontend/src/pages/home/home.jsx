import { useLoaderData, Await } from 'react-router-dom';
import { Suspense } from 'react';
import HomeSkeleton from '../../components/skeletons/HomeSkeleton';

function Home() {
  const { tests } = useLoaderData();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">Table Test (IDs 1 à 10)</h1>
      <Suspense fallback={<HomeSkeleton />}>
        <Await
          resolve={tests}
          errorElement={
            <p className="text-red-500">Erreur lors du chargement des données.</p>
          }
        >
          {(resolvedTests) => (
            resolvedTests.length === 0 ? (
              <p className="text-gray-500">Aucune donnée trouvée</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
                <table className="min-w-full">
                  <thead className="bg-[var(--bg-secondary)]">
                    <tr>
                      <th className="px-4 py-3 border-b border-[var(--border)] text-left text-sm font-medium text-[var(--text-primary)]">ID</th>
                      <th className="px-4 py-3 border-b border-[var(--border)] text-left text-sm font-medium text-[var(--text-primary)]">User ID</th>
                      <th className="px-4 py-3 border-b border-[var(--border)] text-left text-sm font-medium text-[var(--text-primary)]">Email</th>
                      <th className="px-4 py-3 border-b border-[var(--border)] text-left text-sm font-medium text-[var(--text-primary)]">Password</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolvedTests.map((test) => (
                      <tr key={test.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="px-4 py-3 border-b border-[var(--border)] text-[var(--text-primary)]">{test.id}</td>
                        <td className="px-4 py-3 border-b border-[var(--border)] text-[var(--text-secondary)]">{test.name || test.user_id || '-'}</td>
                        <td className="px-4 py-3 border-b border-[var(--border)] text-[var(--text-secondary)]">{test.email || '-'}</td>
                        <td className="px-4 py-3 border-b border-[var(--border)] text-[var(--text-secondary)]">{test.password ? '***' : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export default Home;
