import { useState } from 'react';
import { useUserStore } from '../../../stores/useUserStore';
import type { User } from '../../../stores/useUserStore';
import { searchStationsByAddress, findNearbyStationsByGeolocation } from '../../../shared/api/transportApi';
import type { Station } from '../../../shared/types';

const MAX_STATION_OPTIONS = 3;

export function UserSelector() {
  const { users, selectedUserId, selectUser, setPreferredStation } = useUserStore();
  const [localAddress, setLocalAddress] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [stationLabel, setStationLabel] = useState('');

  const selectedUser = users.find((u) => u.id === selectedUserId) as User | undefined;

  async function findStations(query: string) {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setStations([]);
      setSelectedStationId(null);
      return;
    }

    setLoading(true);
    try {
      const topStations = await searchStationsByAddress(normalizedQuery, MAX_STATION_OPTIONS);
      setStations(topStations);

      if (topStations.length > 0) {
        setSelectedStationId(topStations[0].id);
        setStationLabel(topStations[0].name);
      }
    } catch (err) {
      setStations([]);
      setSelectedStationId(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveAddress() {
    if (!selectedUser || !localAddress.trim()) return;
    findStations(localAddress);
  }

  async function handleGeolocationFind() {
    if (!selectedUser) return;
    console.log('[SETTINGS][GEO][0] Find nearby clicked');
    setLoading(true);
    try {
      const nearbyStations = await findNearbyStationsByGeolocation(MAX_STATION_OPTIONS);
      if (nearbyStations.length > 0) {
        console.log('[SETTINGS][GEO][1] Nearby stations from geolocation:', nearbyStations);
        setStations(nearbyStations);
        setSelectedStationId(nearbyStations[0].id);
        setStationLabel(nearbyStations[0].name);
      } else {
        console.warn('[SETTINGS][GEO][2] No station returned from geolocation flow');
        setStations([]);
        setSelectedStationId(null);
      }
    } catch (err) {
      console.error('[SETTINGS][GEO][ERR] Geolocation button flow failed:', err);
      setStations([]);
      setSelectedStationId(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveStation() {
    if (!selectedUser || !selectedStationId) return;
    const st = stations.find((s) => s.id === selectedStationId);
    if (!st) return;
    setPreferredStation(selectedUser.id, st, stationLabel || st.name);
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">User Profile</h3>
        <p className="text-sm text-slate-600 mb-4">Select a user and set an address to find nearby stops.</p>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500 py-2">No users created yet</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <input type="radio" id={`user-${user.id}`} name="user-selection" checked={selectedUserId === user.id} onChange={() => selectUser(user.id)} className="cursor-pointer" />
                  <label htmlFor={`user-${user.id}`} className="cursor-pointer flex-1">
                    <span className="font-medium text-slate-900">{user.name}</span>
                    {user.preferredStationLabel && (
                      <div className="text-sm text-slate-500">Preferred stop: {user.preferredStationLabel}</div>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected User Controls */}
      {selectedUser && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="text-sm text-blue-900">
            <strong>Selected user:</strong> {selectedUser.name}
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-700">Stop name:</label>
            <div className="flex gap-2">
              <input value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} className="flex-1 rounded border p-2" placeholder={selectedUser.address || 'e.g., Hauptbahnhof, Kray Mitte'} />
              <button onClick={handleSaveAddress} className="btn-primary px-3 py-2">Search</button>
              <button onClick={handleGeolocationFind} className="btn-outline px-3 py-2">📍 Find nearby</button>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Search uses address lookup first, then loads top 3 nearby stop names for saving.
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-slate-700">Suggested stops (top 3):</label>
            {loading ? (
              <div className="text-sm text-slate-500">Searching...</div>
            ) : stations.length === 0 ? (
              <div className="text-sm text-slate-500">No stops found. Try a different address.</div>
            ) : (
              <div className="space-y-2">
                {stations.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <input type="radio" name="station" checked={selectedStationId === s.id} onChange={() => { setSelectedStationId(s.id); setStationLabel(s.name); }} />
                    <div className="flex-1 text-sm">{s.name}</div>
                  </div>
                ))}
                <div className="flex gap-2 items-center">
                  <input value={stationLabel} onChange={(e) => setStationLabel(e.target.value)} placeholder="Optional label for this stop" className="flex-1 rounded border p-2 text-sm" />
                  <button onClick={handleSaveStation} className="btn-secondary px-3 py-2">Save</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
