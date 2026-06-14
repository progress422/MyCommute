import { useUserStore } from '../../../stores/useUserStore';


export function UserSelector() {
  const { users, selectedUserId, selectUser } =
    useUserStore();


  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          User Profile
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Create or select a user to save your preferences.
        </p>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">No users created yet</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="radio"
                    id={`user-${user.id}`}
                    name="user-selection"
                    checked={selectedUserId === user.id}
                    onChange={() => selectUser(user.id)}
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="cursor-pointer flex-1"
                  >
                    <span className="font-medium text-slate-900">
                      {user.name}
                    </span>
                  </label>
                </div>
    
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Selected User Display */}
      {selectedUserId && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Selected user:</strong>{' '}
            {users.find((u) => u.id === selectedUserId)?.name}
          </p>
        </div>
      )}
    </section>
  );
}
