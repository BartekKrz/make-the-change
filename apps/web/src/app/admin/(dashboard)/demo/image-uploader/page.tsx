import { ImageUploader } from '@/components/ImageUploader';

export default function ImageUploaderDemo() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">ImageUploader - Demo</h1>
        <p className="text-muted-foreground mb-6">
          Composant moderne avec drag &amp; drop, preview et gestion d&apos;erreurs.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Upload Simple</h2>
          <ImageUploader
            onImageSelect={(file) => {
              console.log('Image sélectionnée:', file?.name);
            }}
            onImageRemove={() => {
              console.log('Image supprimée');
            }}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Upload avec image existante</h2>
          <ImageUploader
            currentImage="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400"
            onImageSelect={(file) => {
              console.log('Nouvelle image sélectionnée:', file?.name);
            }}
            onImageRemove={() => {
              console.log('Image supprimée');
            }}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Upload désactivé</h2>
          <ImageUploader
            currentImage="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=400"
            disabled={true}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Dimensions personnalisées</h2>
          <ImageUploader
            width="w-64"
            height="h-32"
            onImageSelect={(file) => {
              console.log('Image sélectionnée:', file?.name);
            }}
          />
        </div>
      </div>
    </div>
  );
}
