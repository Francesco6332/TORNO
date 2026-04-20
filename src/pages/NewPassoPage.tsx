import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { DIFFICULTY_LEVELS } from '@/config/constants';
import { useCreatePasso } from '@/hooks/usePassi';
import { useTranslation } from '@/i18n/useTranslation';
import { imageUploadService } from '@/services/imageUploadService';
import type { DifficultyLevel, VehicleType } from '@/types';

const vehicleTypes: VehicleType[] = ['motorcycle', 'car', 'both'];

export default function NewPassoPage() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const createPasso = useCreatePasso();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [vehicleType, setVehicleType] = useState<VehicleType>('both');
  const [elevation, setElevation] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [length, setLength] = useState('');
  const [maxGradient, setMaxGradient] = useState('');
  const [surface, setSurface] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsText, setTagsText] = useState('');
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!user) {
      setError(t('passi.form.errors.auth'));
      return;
    }

    const parsedElevation = Number(elevation);
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);
    const parsedLength = length ? Number(length) : undefined;
    const parsedMaxGradient = maxGradient ? Number(maxGradient) : undefined;

    if (!name.trim() || !region.trim() || !description.trim()) {
      setError(t('passi.form.errors.required'));
      return;
    }

    if (
      !Number.isFinite(parsedElevation) ||
      !Number.isFinite(parsedLat) ||
      !Number.isFinite(parsedLng) ||
      parsedElevation <= 0 ||
      parsedLat < -90 ||
      parsedLat > 90 ||
      parsedLng < -180 ||
      parsedLng > 180
    ) {
      setError(t('passi.form.errors.coordinates'));
      return;
    }

    if (
      (parsedLength !== undefined && (!Number.isFinite(parsedLength) || parsedLength <= 0)) ||
      (parsedMaxGradient !== undefined && (!Number.isFinite(parsedMaxGradient) || parsedMaxGradient <= 0))
    ) {
      setError(t('passi.form.errors.metrics'));
      return;
    }

    try {
      setIsUploadingImage(true);
      const uploadedImageUrl = imageFile
        ? await imageUploadService.upload(imageFile, 'passi')
        : imageUrl.trim();

      const passoId = await createPasso.mutateAsync({
        name: name.trim(),
        region: region.trim(),
        elevation: parsedElevation,
        difficulty,
        vehicleType,
        coordinates: {
          lat: parsedLat,
          lng: parsedLng,
        },
        description: description.trim(),
        length: parsedLength,
        maxGradient: parsedMaxGradient,
        surface: surface.trim() || undefined,
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

      navigate(`/passi/${passoId}`, { replace: true });
    } catch {
      setError(t('passi.form.errors.save'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="glass-card rounded-2xl p-10 w-full max-w-md text-center">
          <h1 className="text-4xl font-display text-white mb-3">{t('passi.form.signInTitle')}</h1>
          <p className="text-gray-400 text-sm mb-8">{t('passi.form.signInText')}</p>
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
        to="/passi"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-400 transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('passi.form.back')}
      </Link>

      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-display text-white mb-3">{t('passi.form.title')}</h1>
        <p className="text-gray-400 max-w-2xl">{t('passi.form.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('passi.form.details')}</h2>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.name')}
              </label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('passi.form.placeholders.name')}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.description')}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('passi.form.placeholders.description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.region')}
                </label>
                <input
                  id="region"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={t('passi.form.placeholders.region')}
                />
              </div>

              <div>
                <label htmlFor="elevation" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.elevation')}
                </label>
                <input
                  id="elevation"
                  type="number"
                  min="1"
                  value={elevation}
                  onChange={(event) => setElevation(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2236"
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('passi.form.location')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.lat')}
                </label>
                <input
                  id="lat"
                  type="number"
                  step="0.000001"
                  value={lat}
                  onChange={(event) => setLat(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="46.518"
                />
              </div>
              <div>
                <label htmlFor="lng" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.lng')}
                </label>
                <input
                  id="lng"
                  type="number"
                  step="0.000001"
                  value={lng}
                  onChange={(event) => setLng(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="11.811"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('passi.form.settings')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('filters.difficulty')}</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('filters.vehicleType')}</label>
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

            <div>
              <label htmlFor="surface" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.surface')}
              </label>
              <input
                id="surface"
                value={surface}
                onChange={(event) => setSurface(event.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('passi.form.placeholders.surface')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.length')}
                </label>
                <input
                  id="length"
                  type="number"
                  min="1"
                  value={length}
                  onChange={(event) => setLength(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="maxGradient" className="block text-sm font-medium text-gray-400 mb-2">
                  {t('passi.form.fields.maxGradient')}
                </label>
                <input
                  id="maxGradient"
                  type="number"
                  min="1"
                  value={maxGradient}
                  onChange={(event) => setMaxGradient(event.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-2xl font-display text-white">{t('passi.form.media')}</h2>
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.imageUpload')}
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white file:mr-4 file:rounded-md file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-2 text-xs text-gray-500">{t('passi.form.imageHelp')}</p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.imageUrl')}
              </label>
              <input
                id="imageUrl"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                disabled={Boolean(imageFile)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('passi.form.placeholders.image')}
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">
                {t('passi.form.fields.tags')}
              </label>
              <input
                id="tags"
                value={tagsText}
                onChange={(event) => setTagsText(event.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('passi.form.placeholders.tags')}
              />
            </div>

            {error && <div className="glass-red rounded-xl p-3 text-sm text-red-300">{error}</div>}

            <button
              type="submit"
              disabled={createPasso.isPending || isUploadingImage}
              className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-white rounded-xl font-medium text-sm disabled:opacity-60"
            >
              {createPasso.isPending || isUploadingImage ? (
                isUploadingImage ? t('imageUpload.uploading') : t('passi.form.saving')
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('passi.form.submit')}
                </>
              )}
            </button>
          </section>
        </aside>
      </form>
    </div>
  );
}
