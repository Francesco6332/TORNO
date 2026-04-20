import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, GripVertical, Save, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { usePassi } from '@/hooks/usePassi';
import { useCreateItinerary } from '@/hooks/useItinerari';
import { useTranslation } from '@/i18n/useTranslation';
import { imageUploadService } from '@/services/imageUploadService';
import type { DifficultyLevel, Passo, VehicleType } from '@/types';

const vehicleTypes: VehicleType[] = ['motorcycle', 'car', 'both'];

const getPassDistance = (from: Passo, to: Passo): number => {
  const radius = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLat = toRadians(to.coordinates.lat - from.coordinates.lat);
  const deltaLng = toRadians(to.coordinates.lng - from.coordinates.lng);
  const lat1 = toRadians(from.coordinates.lat);
  const lat2 = toRadians(to.coordinates.lat);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function NewItineraryPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { data: passi = [], isLoading: passiLoading } = usePassi();
  const createItinerary = useCreateItinerary();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [vehicleType, setVehicleType] = useState<VehicleType>('both');
  const [selectedPassoIds, setSelectedPassoIds] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [manualLength, setManualLength] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const selectedPassi = useMemo(
    () =>
      selectedPassoIds
        .map((id) => passi.find((passo) => passo.id === id))
        .filter((passo): passo is Passo => Boolean(passo)),
    [passi, selectedPassoIds]
  );

  const estimatedLength = useMemo(() => {
    if (selectedPassi.length < 2) return 0;
    return selectedPassi.reduce((total, passo, index) => {
      const nextPasso = selectedPassi[index + 1];
      return nextPasso ? total + getPassDistance(passo, nextPasso) : total;
    }, 0);
  }, [selectedPassi]);

  const totalLength = manualLength ? Number(manualLength) : Math.round(estimatedLength);
  const totalElevationGain = selectedPassi.reduce((total, passo, index) => {
    const previous = selectedPassi[index - 1];
    if (!previous) return total;
    return total + Math.max(passo.elevation - previous.elevation, 0);
  }, 0);
  const estimatedTime = manualTime ? Number(manualTime) : Math.max(1, Math.round(totalLength / 45));

  const addPasso = (passoId: string) => {
    if (!passoId || selectedPassoIds.includes(passoId)) return;
    setSelectedPassoIds((current) => [...current, passoId]);
  };

  const removePasso = (passoId: string) => {
    setSelectedPassoIds((current) => current.filter((id) => id !== passoId));
  };

  const movePasso = (passoId: string, direction: -1 | 1) => {
    setSelectedPassoIds((current) => {
      const index = current.indexOf(passoId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!user) {
      setError(t('itinerari.form.errors.auth'));
      return;
    }

    if (!title.trim() || !description.trim() || !region.trim()) {
      setError(t('itinerari.form.errors.required'));
      return;
    }

    if (selectedPassi.length < 2) {
      setError(t('itinerari.form.errors.passi'));
      return;
    }

    if (!Number.isFinite(totalLength) || totalLength <= 0 || !Number.isFinite(estimatedTime) || estimatedTime <= 0) {
      setError(t('itinerari.form.errors.metrics'));
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedImageUrl = imageFile
        ? await imageUploadService.upload(imageFile, 'itinerari')
        : imageUrl.trim();

      const itineraryId = await createItinerary.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        region: region.trim(),
        difficulty,
        vehicleType,
        passi: selectedPassi,
        totalLength,
        totalElevationGain,
        estimatedTime,
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
        tags: tagsText
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdBy: {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        },
      });

      navigate('/itinerari', { replace: true, state: { createdItineraryId: itineraryId } });
    } catch {
      setError(t('itinerari.form.errors.save'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="glass-card rounded-2xl p-10 w-full max-w-md text-center">
          <h1 className="text-4xl font-display text-white mb-3">{t('itinerari.form.signInTitle')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('itinerari.form.signInText')}</p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-medium text-white"
          >
            {t('profile.googleSignIn')}
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="glass-card rounded-2xl h-80 animate-pulse" />
      </div>
    );
  }

  if (!user) return <Navigate to="/profile" replace />;

  return (
    <div className="container mx-auto px-4 py-10">
      <Link
        to="/itinerari"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-400 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('itinerari.form.back')}
      </Link>

      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-display text-white mb-3">
          {t('itinerari.form.title')}
        </h1>
        <p className="text-gray-400 max-w-2xl">{t('itinerari.form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('itinerari.form.details')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="title">
                {t('itinerari.form.fields.title')}
              </label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('itinerari.form.placeholders.title')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="description">
                {t('itinerari.form.fields.description')}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('itinerari.form.placeholders.description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="region">
                  {t('itinerari.form.fields.region')}
                </label>
                <input
                  id="region"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={t('itinerari.form.placeholders.region')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="imageFile">
                  {t('itinerari.form.fields.imageUpload')}
                </label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white file:mr-4 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="mt-2 text-xs text-gray-500">{t('itinerari.form.imageHelp')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="imageUrl">
                  {t('itinerari.form.fields.imageUrl')}
                </label>
                <input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  disabled={Boolean(imageFile)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={t('itinerari.form.placeholders.image')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="tags">
                {t('itinerari.form.fields.tags')}
              </label>
              <input
                id="tags"
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('itinerari.form.placeholders.tags')}
              />
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('itinerari.form.route')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="passo">
                {t('itinerari.form.fields.addPasso')}
              </label>
              <select
                id="passo"
                value=""
                onChange={(event) => addPasso(event.target.value)}
                disabled={passiLoading}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">{passiLoading ? t('itinerari.form.loadingPassi') : t('itinerari.form.selectPasso')}</option>
                {passi
                  .filter((passo) => !selectedPassoIds.includes(passo.id))
                  .map((passo) => (
                    <option key={passo.id} value={passo.id}>
                      {passo.name} - {passo.region}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-3">
              {selectedPassi.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
                  {t('itinerari.form.noPassi')}
                </div>
              ) : (
                selectedPassi.map((passo, index) => (
                  <div
                    key={passo.id}
                    className="flex items-center gap-3 rounded-xl bg-black/20 border border-white/8 p-3"
                  >
                    <GripVertical className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{passo.name}</p>
                      <p className="text-xs text-gray-500">
                        {passo.region} · {passo.elevation.toLocaleString()} m
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => movePasso(passo.id, -1)}
                        disabled={index === 0}
                        className="btn-secondary px-2 py-1 rounded-md text-xs text-gray-300 disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => movePasso(passo.id, 1)}
                        disabled={index === selectedPassi.length - 1}
                        className="btn-secondary px-2 py-1 rounded-md text-xs text-gray-300 disabled:opacity-40"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removePasso(passo.id)}
                        className="btn-secondary p-1.5 rounded-md text-gray-300 hover:text-primary-400"
                        aria-label={t('itinerari.form.removePasso')}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('itinerari.form.settings')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('filters.difficulty')}
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(DIFFICULTY_LEVELS).map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setDifficulty(level.value)}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                      difficulty === level.value
                        ? 'bg-primary-600/90 text-white border-primary-500'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-gray-100'
                    )}
                  >
                    {level.icon} {t(`difficulty.${level.value}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('filters.vehicleType')}
              </label>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setVehicleType(type)}
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                      vehicleType === type
                        ? 'bg-primary-600/90 text-white border-primary-500'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-gray-100'
                    )}
                  >
                    {t(type === 'both' ? 'vehicle.both' : `vehicle.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="length">
                  {t('itinerari.form.fields.length')}
                </label>
                <input
                  id="length"
                  type="number"
                  min="1"
                  value={manualLength}
                  onChange={(event) => setManualLength(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={String(Math.round(estimatedLength))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="time">
                  {t('itinerari.form.fields.time')}
                </label>
                <input
                  id="time"
                  type="number"
                  min="1"
                  value={manualTime}
                  onChange={(event) => setManualTime(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={String(Math.max(1, Math.round(totalLength / 45)))}
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-2xl font-display text-white">{t('itinerari.form.summary')}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">{t('itinerari.form.summaryPassi')}</p>
                <p className="text-xl font-display text-white">{selectedPassi.length}</p>
              </div>
              <div>
                <p className="text-gray-500">{t('detail.length')}</p>
                <p className="text-xl font-display text-white">{totalLength || 0} km</p>
              </div>
              <div>
                <p className="text-gray-500">{t('detail.elevation')}</p>
                <p className="text-xl font-display text-white">{totalElevationGain.toLocaleString()} m</p>
              </div>
              <div>
                <p className="text-gray-500">{t('itinerari.form.summaryTime')}</p>
                <p className="text-xl font-display text-white">{estimatedTime || 0}h</p>
              </div>
            </div>

            {error && <div className="glass-red rounded-xl p-3 text-sm text-red-300">{error}</div>}

            <button
              type="submit"
              disabled={createItinerary.isPending || isUploadingImage}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-white rounded-xl font-medium text-sm disabled:opacity-60"
            >
              {createItinerary.isPending || isUploadingImage ? (
                isUploadingImage ? t('imageUpload.uploading') : t('itinerari.form.saving')
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('itinerari.form.submit')}
                </>
              )}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}
