import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  Save,
  Plus,
  Trash2,
  Upload,
  Palette,
  Check,
  Wrench,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getAbout,
  updateAbout,
  addTool,
  deleteTool,
  updateToolLogo,
} from "./aboutApi";

import type {
  About,
  AboutExpertise,
} from "./types/about";

import { useLoading } from "../../context/LoadingContext";

/*
|--------------------------------------------------------------------------
| ICONS
|--------------------------------------------------------------------------
*/

const availableIcons = [
  "Palette",
  "PenTool",
  "Box",
  "Code2",
  "Monitor",
  "Globe",
  "Camera",
  "Database",
  "Layout",
  "Layers",
  "Smartphone",
  "Laptop",
  "Server",
  "Brush",
  "Figma",
  "Code",
];

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function AboutManagement() {
  const [about, setAbout] =
    useState<About | null>(null);

  const [title, setTitle] =
    useState("");

  const [expertise, setExpertise] =
    useState<AboutExpertise[]>([]);

  const [toolsTitle, setToolsTitle] =
    useState("");

  const [newToolName, setNewToolName] =
    useState("");

  const [newToolLogo, setNewToolLogo] =
    useState<File | null>(null);

  const [newToolPreview, setNewToolPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [addingTool, setAddingTool] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | GLOBAL LOADING
  |--------------------------------------------------------------------------
  */

  const {
    startLoading,
    stopLoading,
  } = useLoading();

  /*
  |--------------------------------------------------------------------------
  | LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout =
    async (): Promise<void> => {
      startLoading();

      try {
        const data =
          await getAbout();

        setAbout(data);
        setTitle(data.title);
        setExpertise(data.expertise);
        setToolsTitle(data.toolsTitle);
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible de charger About."
        );
      } finally {
        stopLoading();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE EXPERTISE
  |--------------------------------------------------------------------------
  */

  const updateExpertise = (
    index: number,
    field: keyof AboutExpertise,
    value: string
  ) => {
    setExpertise((current) =>
      current.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async (): Promise<void> => {
      try {
        setSaving(true);
        startLoading();

        if (!title.trim()) {
          throw new Error(
            "Le titre principal est obligatoire."
          );
        }

        if (expertise.length !== 4) {
          throw new Error(
            "Vous devez avoir exactement 4 expertises."
          );
        }

        for (const item of expertise) {
          if (!item.title.trim()) {
            throw new Error(
              "Tous les titres d'expertise sont obligatoires."
            );
          }

          if (!item.description.trim()) {
            throw new Error(
              "Toutes les descriptions d'expertise sont obligatoires."
            );
          }

          if (!item.icon.trim()) {
            throw new Error(
              "Toutes les icônes d'expertise sont obligatoires."
            );
          }
        }

        if (!toolsTitle.trim()) {
          throw new Error(
            "Le titre des outils est obligatoire."
          );
        }

        const result =
          await updateAbout({
            title: title.trim(),
            expertise,
            toolsTitle: toolsTitle.trim(),
          });

        setAbout(result.about);

        toast.success(
          "Les modifications ont été enregistrées."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue."
        );
      } finally {
        setSaving(false);
        stopLoading();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | ADD TOOL
  |--------------------------------------------------------------------------
  */

  const handleToolLogo = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        "Le logo ne doit pas dépasser 2 Mo."
      );

      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format accepté : PNG, JPG, WEBP ou SVG."
      );

      event.target.value = "";
      return;
    }

    setNewToolLogo(file);

    setNewToolPreview(
      URL.createObjectURL(file)
    );
  };

  const handleAddTool =
    async (): Promise<void> => {
      if (!newToolName.trim()) {
        toast.error(
          "Le nom de l'outil est obligatoire."
        );
        return;
      }

      if (!newToolLogo) {
        toast.error(
          "Le logo de l'outil est obligatoire."
        );
        return;
      }

      try {
        setAddingTool(true);
        startLoading();

        const result =
          await addTool(
            newToolName.trim(),
            newToolLogo
          );

        setAbout(result.about);

        setNewToolName("");
        setNewToolLogo(null);
        setNewToolPreview("");

        toast.success(
          "Outil ajouté avec succès."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible d'ajouter l'outil."
        );
      } finally {
        setAddingTool(false);
        stopLoading();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE TOOL
  |--------------------------------------------------------------------------
  */

  const handleDeleteTool =
    async (
      toolId: string,
      toolName: string
    ): Promise<void> => {
      const confirmed =
        window.confirm(
          `Voulez-vous vraiment supprimer "${toolName}" ?`
        );

      if (!confirmed) return;

      try {
        startLoading();

        const result =
          await deleteTool(toolId);

        setAbout(result.about);

        toast.success(
          "Outil supprimé avec succès."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible de supprimer l'outil."
        );
      } finally {
        stopLoading();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | UPDATE TOOL LOGO
  |--------------------------------------------------------------------------
  */

  const handleUpdateLogo =
    async (
      toolId: string,
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error(
          "Le logo ne doit pas dépasser 2 Mo."
        );

        event.target.value = "";
        return;
      }

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Format accepté : PNG, JPG, WEBP ou SVG."
        );

        event.target.value = "";
        return;
      }

      try {
        startLoading();

        const result =
          await updateToolLogo(
            toolId,
            file
          );

        setAbout(result.about);

        toast.success(
          "Logo mis à jour avec succès."
        );
      } catch (err) {
        console.error(err);

        toast.error(
          err instanceof Error
            ? err.message
            : "Impossible de modifier le logo."
        );
      } finally {
        stopLoading();
      }
    };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="mx-auto max-w-6xl">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-medium text-primary">
            Portfolio
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
            About
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Gérez le contenu de votre section
            About, vos expertises et les outils
            que vous utilisez quotidiennement.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-zinc-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-zinc-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Save size={17} />

          {saving
            ? "Enregistrement..."
            : "Enregistrer"}
        </button>
      </div>

      <div className="space-y-6">

        {/* TITLE */}

        <section className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-6
          md:p-8
        ">
          <div className="mb-6 flex items-start gap-4">

            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-zinc-100
            ">
              <Palette size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900">
                Titre
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Titre principal de la section About.
              </p>
            </div>

          </div>

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="What I Do Best"
            className="
              w-full
              rounded-xl
              border
              border-zinc-200
              bg-white
              px-4
              py-3
              text-sm
              text-zinc-900
              outline-none
              transition
              focus:border-primary
            "
          />
        </section>

        {/* EXPERTISE */}

        <section className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-6
          md:p-8
        ">

          <div className="mb-6">
            <h3 className="font-semibold text-zinc-900">
              Expertises
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Gérez les quatre cartes affichées
              dans votre section About.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {expertise.map(
              (item, index) => (

                <div
                  key={
                    item._id || index
                  }
                  className="
                    rounded-xl
                    border
                    border-zinc-200
                    p-5
                  "
                >

                  <div className="mb-5 flex items-center justify-between">

                    <span className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-zinc-400
                    ">
                      Expertise {index + 1}
                    </span>

                  </div>

                  {/* TITLE */}

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-800
                  ">
                    Titre
                  </label>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) =>
                      updateExpertise(
                        index,
                        "title",
                        event.target.value
                      )
                    }
                    className="
                      mb-5
                      w-full
                      rounded-xl
                      border
                      border-zinc-200
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-primary
                    "
                  />

                  {/* DESCRIPTION */}

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-800
                  ">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={
                      item.description
                    }
                    onChange={(event) =>
                      updateExpertise(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    className="
                      mb-5
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-zinc-200
                      px-4
                      py-3
                      text-sm
                      leading-6
                      outline-none
                      focus:border-primary
                    "
                  />

                  {/* ICON */}

                  <label className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-zinc-800
                  ">
                    Icône
                  </label>

                  <select
                    value={item.icon}
                    onChange={(event) =>
                      updateExpertise(
                        index,
                        "icon",
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-primary
                    "
                  >
                    {availableIcons.map(
                      (icon) => (
                        <option
                          key={icon}
                          value={icon}
                        >
                          {icon}
                        </option>
                      )
                    )}
                  </select>

                </div>
              )
            )}

          </div>
        </section>

        {/* TOOLS TITLE */}

        <section className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-6
          md:p-8
        ">

          <div className="mb-6 flex items-start gap-4">

            <div className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-zinc-100
            ">
              <Wrench size={19} />
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900">
                Outils
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Modifiez le titre de la section des
                outils.
              </p>
            </div>

          </div>

          <input
            type="text"
            value={toolsTitle}
            onChange={(event) =>
              setToolsTitle(
                event.target.value
              )
            }
            placeholder="Outils du quotidien"
            className="
              w-full
              rounded-xl
              border
              border-zinc-200
              px-4
              py-3
              text-sm
              outline-none
              focus:border-primary
            "
          />

        </section>

        {/* ADD TOOL */}

        <section className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-6
          md:p-8
        ">

          <div className="mb-6">

            <h3 className="font-semibold text-zinc-900">
              Ajouter un outil
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Ajoutez un outil avec son logo.
              Taille maximale : 2 Mo.
            </p>

          </div>

          <div className="
            grid
            gap-6
            lg:grid-cols-[1fr_220px]
          ">

            <div>

              <label className="
                mb-2
                block
                text-sm
                font-medium
                text-zinc-800
              ">
                Nom de l'outil
              </label>

              <input
                type="text"
                value={newToolName}
                onChange={(event) =>
                  setNewToolName(
                    event.target.value
                  )
                }
                placeholder="Ex : Blender"
                className="
                  w-full
                  rounded-xl
                  border
                  border-zinc-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  focus:border-primary
                "
              />

              <label className="
                mt-5
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-zinc-200
                px-4
                py-3
                text-sm
                font-medium
                text-zinc-700
                transition
                hover:border-primary
                hover:text-primary
              ">

                <Upload size={17} />

                Choisir le logo

                <input
                  type="file"
                  accept="
                    image/png,
                    image/jpeg,
                    image/webp,
                    image/svg+xml
                  "
                  className="hidden"
                  onChange={
                    handleToolLogo
                  }
                />

              </label>

              {newToolLogo && (
                <p className="
                  mt-2
                  text-xs
                  text-zinc-500
                ">
                  {newToolLogo.name}
                </p>
              )}

            </div>

            <div className="
              flex
              min-h-[180px]
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-zinc-300
              bg-zinc-50
              p-5
            ">

              {newToolPreview ? (
                <img
                  src={newToolPreview}
                  alt="Preview"
                  className="
                    h-24
                    w-24
                    object-contain
                  "
                />
              ) : (
                <div className="text-center">

                  <Upload
                    size={30}
                    className="
                      mx-auto
                      text-zinc-300
                    "
                  />

                  <p className="
                    mt-2
                    text-xs
                    text-zinc-400
                  ">
                    Aperçu du logo
                  </p>

                </div>
              )}

            </div>

          </div>

          <button
            type="button"
            onClick={handleAddTool}
            disabled={addingTool}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-zinc-900
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-zinc-800
              disabled:opacity-50
            "
          >

            <Plus size={17} />

            {addingTool
              ? "Ajout..."
              : "Ajouter l'outil"}

          </button>

        </section>

        {/* TOOLS LIST */}

        <section className="
          rounded-xl
          border
          border-zinc-200
          bg-white
          p-6
          md:p-8
        ">

          <div className="mb-6">

            <h3 className="font-semibold text-zinc-900">
              Outils enregistrés
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Ajoutez, modifiez ou supprimez vos outils.
            </p>

          </div>

          {about?.tools.length === 0 ? (

            <div className="
              rounded-xl
              border
              border-dashed
              border-zinc-300
              p-10
              text-center
            ">

              <Wrench
                size={30}
                className="
                  mx-auto
                  text-zinc-300
                "
              />

              <p className="
                mt-3
                text-sm
                text-zinc-400
              ">
                Aucun outil enregistré.
              </p>

            </div>

          ) : (

            <div className="
              grid
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
            ">

              {about?.tools.map(
                (tool) => (

                  <div
                    key={tool._id}
                    className="
                      group
                      rounded-xl
                      border
                      border-zinc-200
                      p-5
                      transition
                      hover:border-zinc-300
                    "
                  >

                    <div className="
                      flex
                      items-center
                      justify-between
                    ">

                      <div className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-xl
                        bg-zinc-50
                      ">

                        <img
                          src={
                            tool.logo.url
                          }
                          alt={
                            tool.name
                          }
                          className="
                            h-10
                            w-10
                            object-contain
                          "
                        />

                      </div>

                      <button
                        type="button"
                        title="Supprimer"
                        onClick={() =>
                          handleDeleteTool(
                            tool._id,
                            tool.name
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-zinc-400
                          transition
                          hover:bg-red-50
                          hover:text-red-500
                        "
                      >

                        <Trash2 size={17} />

                      </button>

                    </div>

                    <p className="
                      mt-4
                      text-sm
                      font-medium
                      text-zinc-800
                    ">
                      {tool.name}
                    </p>

                    <label className="
                      mt-4
                      flex
                      cursor-pointer
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-zinc-200
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-zinc-600
                      transition
                      hover:border-primary
                      hover:text-primary
                    ">

                      <Upload size={14} />

                      Modifier logo

                      <input
                        type="file"
                        accept="
                          image/png,
                          image/jpeg,
                          image/webp,
                          image/svg+xml
                        "
                        className="hidden"
                        onChange={(event) =>
                          handleUpdateLogo(
                            tool._id,
                            event
                          )
                        }
                      />

                    </label>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}