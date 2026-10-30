import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  ADD_EVENT,
  GET_EVENTS,
  GET_METADATA_FOR_NEW_EVENT,
} from '../graphql/queries.ts';
import { X, Calendar, Plus, Clock, MapPin, User, AlertCircle, Check } from 'lucide-react';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { data: metaData } = useQuery<{
    users: Array<{ id: string; username: string; email: string; role?: string }>;
    locations: Array<{ id: string; name: string; address?: string }>;
  }>(GET_METADATA_FOR_NEW_EVENT);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('2026-12-18');
  const [from, setFrom] = useState('14:00');
  const [to, setTo] = useState('17:00');
  const [locationId, setLocationId] = useState('1');
  const [userId, setUserId] = useState('1'); // Enes Öztürk
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [addEventMutation, { loading }] = useMutation<{
    addEvent: { id: string; title: string };
  }>(ADD_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }],
    onCompleted: (result) => {
      if (result?.addEvent?.id) {
        onSuccess(result.addEvent.id);
      }
      onClose();
    },
    onError: (err) => {
      setErrorMessage(err.message);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !desc.trim()) {
      setErrorMessage('Lütfen etkinlik başlığını ve açıklamasını doldurunuz.');
      return;
    }

    try {
      await addEventMutation({
        variables: {
          data: {
            title: title.trim(),
            desc: desc.trim(),
            date,
            from,
            to,
            location_id: locationId,
            user_id: userId,
          },
        },
      });
    } catch {
      // Handled in onError
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 tracking-wider">
                GRAPHQL MUTATION
              </div>
              <h2 className="text-sm font-bold text-slate-100">Yeni Etkinlik Oluştur</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Etkinlik Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: GraphQL ile Gerçek Zamanlı Subscription Eğitimi"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Etkinlik Açıklaması *
            </label>
            <textarea
              required
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Etkinliğin kapsamı, katılımcıların öğrenecekleri ve ön koşullar..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Tarih</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Başlangıç</span>
              </label>
              <input
                type="time"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Bitiş</span>
              </label>
              <input
                type="time"
                required
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Lokasyon / Mekan</span>
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              >
                {metaData?.locations?.map((l: any) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                )) || (
                  <>
                    <option value="1">Kolektif House Levent</option>
                    <option value="2">İTÜ Çekirdek İnovasyon Merkezi</option>
                    <option value="3">Habita Coworking Space</option>
                    <option value="4">Kadıköy Tasarım Atölyesi (TAK)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Etkinlik Sahibi</span>
              </label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              >
                {metaData?.users?.map((u: any) => (
                  <option key={u.id} value={u.id}>
                    @{u.username} ({u.role || u.email})
                  </option>
                )) || (
                  <>
                    <option value="1">@enes_ozturk (Proje Sahibi)</option>
                    <option value="2">@mehmet_seven (GraphQL Lead)</option>
                    <option value="3">@ayse_kaya (DevRel)</option>
                    <option value="4">@can_demir (DevOps)</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors"
            >
              {loading ? (
                <span>Oluşturuluyor...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Etkinliği Yayınla (addEvent)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
