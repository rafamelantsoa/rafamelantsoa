import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Plus,
  Save,
  Trash2,
  Pencil,
  X,
  Upload,
  GripVertical,
  Loader2,
} from "lucide-react";
import { useLoading } from "../../context/LoadingContext";

/* ================================================================
   TYPES
================================================================ */

type ProjectImage = {
  _id?: string;
  url: string;
  publicId?: string | null;
};

type Project = {
  _id: string;
  title: string;
  category: string;
  description: string;
  client: string;
  year: string;
  services: string[];
  projectUrl: string;
  image: ProjectImage;
  gallery: ProjectImage[];
  order: number;
};

type RealisationsData = {
  _id: string;
  title: string;
  description: string;
  projects: Project[];
};

/* ================================================================
   API
================================================================ */

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/realisations`;

/* ================================================================
   COMPONENT
================================================================ */

const RealisationsManagement = () => {
  const { startLoading, stopLoading } = useLoading();

  const [data, setData] = useState<RealisationsData | null>(null);

  const [savingSection, setSavingSection] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  const [deletingProject, setDeletingProject] = useState<string | null>(
    null
  );

  const [editingProject, setEditingProject] = useState<Project | null>(
    null
  );

  const [showAddProject, setShowAddProject] = useState(false);

  /* ================================================================
     FORM
  ================================================================ */

  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectClient, setProjectClient] = useState("");
  const [projectYear, setProjectYear] = useState("");
  const [projectServices, setProjectServices] = useState("");
  const [projectUrl, setProjectUrl] = useState("");

  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /* ================================================================
     GALLERY
  ================================================================ */

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [deletingGalleryImage, setDeletingGalleryImage] =
    useState<string | null>(null);

  /* ================================================================
     GET DATA
  ================================================================ */

  const fetchRealisations = async () => {
    try {
      startLoading();

      const response = await axios.get(API_URL);

      setData(response.data);
    } catch (error) {
      console.error("Erreur récupération réalisations:", error);

      toast.error("Impossible de charger les réalisations.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchRealisations();
  }, []);

  /* ================================================================
     SAVE SECTION
  ================================================================ */

  const handleSaveSection = async () => {
    if (!data) return;

    if (!data.title.trim()) {
      toast.error("Le grand titre est obligatoire.");
      return;
    }

    if (!data.description.trim()) {
      toast.error("Le paragraphe est obligatoire.");
      return;
    }

    try {
      setSavingSection(true);
      startLoading();

      const response = await axios.put(API_URL, {
        title: data.title.trim(),
        description: data.description.trim(),
      });

      setData(response.data.data);

      toast.success("Section Realisations mise à jour.");
    } catch (error) {
      console.error("Erreur sauvegarde section:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de l'enregistrement."
        );
      } else {
        toast.error("Erreur lors de l'enregistrement.");
      }
    } finally {
      setSavingSection(false);
      stopLoading();
    }
  };

  /* ================================================================
     MAIN IMAGE
  ================================================================ */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Format non autorisé. Utilisez JPG, PNG ou WEBP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 10 MB.");

      event.target.value = "";
      return;
    }

    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setProjectImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  /* ================================================================
     GALLERY FILES
  ================================================================ */

  const handleGalleryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name} : format non autorisé.`
        );

        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          `${file.name} dépasse 10 MB.`
        );

        return false;
      }

      return true;
    });

    if (!validFiles.length) {
      event.target.value = "";
      return;
    }

    const previews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryFiles((prev) => [
      ...prev,
      ...validFiles,
    ]);

    setGalleryPreviews((prev) => [
      ...prev,
      ...previews,
    ]);

    event.target.value = "";
  };

  /* ================================================================
     REMOVE NEW GALLERY IMAGE
  ================================================================ */

  const removeGalleryFile = (index: number) => {
    const preview = galleryPreviews[index];

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setGalleryFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setGalleryPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ================================================================
     DELETE EXISTING GALLERY IMAGE
  ================================================================ */

  const handleDeleteGalleryImage = async (
    projectId: string,
    imageId: string
  ) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette image ?"
    );

    if (!confirmed) return;

    try {
      setDeletingGalleryImage(imageId);

      startLoading();

      const response = await axios.delete(
        `${API_URL}/projects/${projectId}/gallery/${imageId}`
      );

      const updatedData: RealisationsData =
        response.data.data;

      setData(updatedData);

      if (editingProject?._id === projectId) {
        const updatedProject =
          updatedData.projects.find(
            (project) => project._id === projectId
          );

        if (updatedProject) {
          setEditingProject(updatedProject);
        }
      }

      toast.success("Image supprimée.");
    } catch (error) {
      console.error(
        "Erreur suppression image:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Impossible de supprimer l'image."
        );
      } else {
        toast.error(
          "Impossible de supprimer l'image."
        );
      }
    } finally {
      setDeletingGalleryImage(null);
      stopLoading();
    }
  };

  /* ================================================================
     RESET FORM
  ================================================================ */

  const resetForm = () => {
    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    galleryPreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    setProjectTitle("");
    setProjectCategory("");
    setProjectDescription("");
    setProjectClient("");
    setProjectYear("");
    setProjectServices("");
    setProjectUrl("");

    setProjectImage(null);
    setPreviewImage(null);

    setGalleryFiles([]);
    setGalleryPreviews([]);

    setEditingProject(null);
    setShowAddProject(false);
  };

  /* ================================================================
     ADD PROJECT
  ================================================================ */

  const handleAddProject = async () => {
    if (!projectTitle.trim()) {
      toast.error("Veuillez saisir le nom du projet.");
      return;
    }

    if (!projectCategory.trim()) {
      toast.error("Veuillez saisir la catégorie.");
      return;
    }

    if (!projectImage) {
      toast.error(
        "Veuillez sélectionner une image principale."
      );
      return;
    }

    try {
      setSavingProject(true);
      startLoading();

      const formData = new FormData();

      formData.append(
        "title",
        projectTitle.trim()
      );

      formData.append(
        "category",
        projectCategory.trim()
      );

      formData.append(
        "description",
        projectDescription.trim()
      );

      formData.append(
        "client",
        projectClient.trim()
      );

      formData.append(
        "year",
        projectYear.trim()
      );

      formData.append(
        "projectUrl",
        projectUrl.trim()
      );

      const services = projectServices
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      formData.append(
        "services",
        JSON.stringify(services)
      );

      formData.append(
        "image",
        projectImage
      );

      const response = await axios.post(
        `${API_URL}/projects`,
        formData
      );

      let updatedData: RealisationsData =
        response.data.data;

      /*
       * Le backend doit retourner le projet créé
       * dans la liste projects.
       */

      const createdProject =
        updatedData.projects[
          updatedData.projects.length - 1
        ];

      if (
        createdProject &&
        galleryFiles.length > 0
      ) {
        const galleryFormData = new FormData();

        galleryFiles.forEach((file) => {
          galleryFormData.append(
            "images",
            file
          );
        });

        const galleryResponse =
          await axios.post(
            `${API_URL}/projects/${createdProject._id}/gallery`,
            galleryFormData
          );

        updatedData =
          galleryResponse.data.data;
      }

      setData(updatedData);

      resetForm();

      toast.success(
        "Projet ajouté avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur ajout projet:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de l'ajout du projet."
        );
      } else {
        toast.error(
          "Erreur lors de l'ajout du projet."
        );
      }
    } finally {
      setSavingProject(false);
      stopLoading();
    }
  };

  /* ================================================================
     START EDIT
  ================================================================ */

  const handleEdit = (project: Project) => {
    setEditingProject(project);

    setProjectTitle(project.title);
    setProjectCategory(project.category);
    setProjectDescription(
      project.description || ""
    );

    setProjectClient(
      project.client || ""
    );

    setProjectYear(
      project.year || ""
    );

    setProjectServices(
      project.services?.join(", ") || ""
    );

    setProjectUrl(
      project.projectUrl || ""
    );

    setProjectImage(null);

    setPreviewImage(
      project.image?.url || null
    );

    setGalleryFiles([]);
    setGalleryPreviews([]);

    setShowAddProject(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================================================
     UPDATE PROJECT
  ================================================================ */

  const handleUpdateProject = async () => {
    if (!editingProject) return;

    if (!projectTitle.trim()) {
      toast.error(
        "Veuillez saisir le nom du projet."
      );
      return;
    }

    if (!projectCategory.trim()) {
      toast.error(
        "Veuillez saisir la catégorie."
      );
      return;
    }

    try {
      setSavingProject(true);
      startLoading();

      const formData = new FormData();

      formData.append(
        "title",
        projectTitle.trim()
      );

      formData.append(
        "category",
        projectCategory.trim()
      );

      formData.append(
        "description",
        projectDescription.trim()
      );

      formData.append(
        "client",
        projectClient.trim()
      );

      formData.append(
        "year",
        projectYear.trim()
      );

      formData.append(
        "projectUrl",
        projectUrl.trim()
      );

      const services = projectServices
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      formData.append(
        "services",
        JSON.stringify(services)
      );

      if (projectImage) {
        formData.append(
          "image",
          projectImage
        );
      }

      const response = await axios.put(
        `${API_URL}/projects/${editingProject._id}`,
        formData
      );

      let updatedData: RealisationsData =
        response.data.data;

      /*
       * Ajouter les nouvelles images
       * à la galerie.
       */

      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();

        galleryFiles.forEach((file) => {
          galleryFormData.append(
            "images",
            file
          );
        });

        const galleryResponse =
          await axios.post(
            `${API_URL}/projects/${editingProject._id}/gallery`,
            galleryFormData
          );

        updatedData =
          galleryResponse.data.data;
      }

      setData(updatedData);

      resetForm();

      toast.success(
        "Projet modifié avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur modification projet:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la modification."
        );
      } else {
        toast.error(
          "Erreur lors de la modification."
        );
      }
    } finally {
      setSavingProject(false);
      stopLoading();
    }
  };

  /* ================================================================
     DELETE PROJECT
  ================================================================ */

  const handleDeleteProject = async (
    projectId: string
  ) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce projet ?"
    );

    if (!confirmed) return;

    try {
      setDeletingProject(projectId);

      startLoading();

      const response = await axios.delete(
        `${API_URL}/projects/${projectId}`
      );

      setData(response.data.data);

      if (
        editingProject?._id === projectId
      ) {
        resetForm();
      }

      toast.success(
        "Projet supprimé avec succès."
      );
    } catch (error) {
      console.error(
        "Erreur suppression projet:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la suppression."
        );
      } else {
        toast.error(
          "Erreur lors de la suppression."
        );
      }
    } finally {
      setDeletingProject(null);
      stopLoading();
    }
  };

  /* ================================================================
     REORDER
  ================================================================ */

  const moveProject = async (
    index: number,
    direction: "up" | "down"
  ) => {
    if (!data) return;

    const projects = [...data.projects].sort(
      (a, b) => a.order - b.order
    );

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >= projects.length
    ) {
      return;
    }

    [
      projects[index],
      projects[newIndex],
    ] = [
      projects[newIndex],
      projects[index],
    ];

    const orderedProjects =
      projects.map((project, i) => ({
        ...project,
        order: i,
      }));

    setData({
      ...data,
      projects: orderedProjects,
    });

    try {
      startLoading();

      await axios.put(
        `${API_URL}/projects/reorder`,
        {
          projects:
            orderedProjects.map(
              (project, i) => ({
                id: project._id,
                order: i,
              })
            ),
        }
      );

      toast.success(
        "Ordre des projets mis à jour."
      );
    } catch (error) {
      console.error(
        "Erreur réorganisation:",
        error
      );

      toast.error(
        "Impossible de modifier l'ordre."
      );

      await fetchRealisations();
    } finally {
      stopLoading();
    }
  };

  /* ================================================================
     ERROR
  ================================================================ */

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-red-500">
            Impossible de charger les réalisations.
          </p>

          <button
            type="button"
            onClick={fetchRealisations}
            className="mt-4 rounded-lg bg-[#2464cc] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1d55b0]"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /* ================================================================
     INPUT CLASS
  ================================================================ */

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#2464cc] dark:border-gray-700 dark:bg-gray-800 dark:text-white";

  /* ================================================================
     SORTED PROJECTS
  ================================================================ */

  const sortedProjects = [...data.projects].sort(
    (a, b) => a.order - b.order
  );

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Realisations
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez le contenu et les projets affichés sur votre portfolio.
        </p>
      </div>

      {/* SECTION CONTENT */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contenu de la section
            </h2>

            <p className="text-sm text-gray-500">
              Titre et paragraphe de la section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveSection}
            disabled={savingSection}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d55b0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingSection ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {savingSection
              ? "Enregistrement..."
              : "Enregistrer"}
          </button>
        </div>

        <div className="space-y-5">

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Grand titre
            </label>

            <input
              type="text"
              value={data.title}
              onChange={(e) =>
                setData({
                  ...data,
                  title: e.target.value,
                })
              }
              className={inputClass}
              placeholder="Selected Work"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paragraphe
            </label>

            <textarea
              rows={4}
              value={data.description}
              onChange={(e) =>
                setData({
                  ...data,
                  description: e.target.value,
                })
              }
              className={`${inputClass} resize-none`}
              placeholder="Description de la section..."
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          ADD / EDIT PROJECT
      ============================================================ */}

      {(showAddProject || editingProject) && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingProject
                  ? "Modifier le projet"
                  : "Ajouter un projet"}
              </h2>

              <p className="text-sm text-gray-500">
                Informations et galerie du projet.
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* IMAGE PRINCIPALE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image principale
              </label>

              <label className="group relative flex min-h-[260px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">

                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Upload
                      size={30}
                      className="mx-auto mb-3 text-gray-400"
                    />

                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Cliquez pour choisir une image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      JPG, PNG ou WEBP
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {previewImage && (
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-3 text-center text-xs text-white opacity-0 transition group-hover:opacity-100">
                    Cliquer pour changer l'image
                  </div>
                )}
              </label>
            </div>

            {/* INFORMATIONS */}

            <div className="space-y-5">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du projet
                </label>

                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) =>
                    setProjectTitle(e.target.value)
                  }
                  className={inputClass}
                  placeholder="Mirasa Association"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie
                </label>

                <input
                  type="text"
                  value={projectCategory}
                  onChange={(e) =>
                    setProjectCategory(e.target.value)
                  }
                  className={inputClass}
                  placeholder="Web Design • Development"
                />
              </div>

              {/* CLIENT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Client / Société
                </label>

                <input
                  type="text"
                  value={projectClient}
                  onChange={(e) =>
                    setProjectClient(e.target.value)
                  }
                  className={inputClass}
                  placeholder="Mirasa Association"
                />
              </div>

              {/* YEAR */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Année
                </label>

                <input
                  type="text"
                  value={projectYear}
                  onChange={(e) =>
                    setProjectYear(e.target.value)
                  }
                  className={inputClass}
                  placeholder="2026"
                />
              </div>

              {/* SERVICES */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Services / Technologies
                </label>

                <input
                  type="text"
                  value={projectServices}
                  onChange={(e) =>
                    setProjectServices(e.target.value)
                  }
                  className={inputClass}
                  placeholder="Branding, UI Design, React, Node.js"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Séparez les éléments par des virgules.
                </p>
              </div>

              {/* URL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lien du projet
                </label>

                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) =>
                    setProjectUrl(e.target.value)
                  }
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description détaillée
            </label>

            <textarea
              rows={7}
              value={projectDescription}
              onChange={(e) =>
                setProjectDescription(e.target.value)
              }
              className={`${inputClass} resize-none`}
              placeholder="Décrivez le projet, le contexte, les objectifs et les réalisations..."
            />
          </div>

          {/* GALLERY */}

          <div className="mt-6">

            <div className="mb-3 flex items-center justify-between">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Galerie du projet
                </label>

                <p className="text-xs text-gray-400">
                  Ajoutez plusieurs images supplémentaires.
                </p>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                <Plus size={16} />
                Ajouter des images

                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* EXISTING IMAGES */}

            {editingProject &&
              editingProject.gallery?.length > 0 && (
                <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                  {editingProject.gallery.map(
                    (image) => (
                      <div
                        key={image._id || image.url}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                      >
                        <img
                          src={image.url}
                          alt="Galerie"
                          className="h-full w-full object-cover"
                        />

                        {image._id && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteGalleryImage(
                                editingProject._id,
                                image._id!
                              )
                            }
                            disabled={
                              deletingGalleryImage ===
                              image._id
                            }
                            className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white opacity-0 transition group-hover:opacity-100 disabled:opacity-50"
                          >
                            {deletingGalleryImage ===
                            image._id ? (
                              <Loader2
                                size={16}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            {/* NEW IMAGES */}

            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">

                {galleryPreviews.map(
                  (preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-[#2464cc]"
                    >
                      <img
                        src={preview}
                        alt="Nouvelle image"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeGalleryFile(index)
                        }
                        className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={
                editingProject
                  ? handleUpdateProject
                  : handleAddProject
              }
              disabled={savingProject}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2464cc] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d55b0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingProject ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {savingProject
                ? "Enregistrement..."
                : editingProject
                ? "Enregistrer les modifications"
                : "Ajouter le projet"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={savingProject}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PROJECTS LIST
      ============================================================ */}

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Projets
            </h2>

            <p className="text-sm text-gray-500">
              {data.projects.length} projet
              {data.projects.length > 1 ? "s" : ""}
            </p>
          </div>

          {!showAddProject &&
            !editingProject && (
              <button
                type="button"
                onClick={() =>
                  setShowAddProject(true)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1d55b0]"
              >
                <Plus size={18} />
                Ajouter
              </button>
            )}
        </div>

        {sortedProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">

            <p className="text-sm text-gray-500">
              Aucun projet pour le moment.
            </p>

            <button
              type="button"
              onClick={() =>
                setShowAddProject(true)
              }
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2464cc] px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={17} />
              Ajouter le premier projet
            </button>
          </div>
        ) : (
          <div className="space-y-4">

            {sortedProjects.map(
              (project, index) => (
                <div
                  key={project._id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
                >

                  {/* DRAG */}

                  <div className="hidden text-gray-400 sm:block">
                    <GripVertical size={20} />
                  </div>

                  {/* IMAGE */}

                  <img
                    src={project.image?.url}
                    alt={project.title}
                    className="h-24 w-full rounded-lg object-cover sm:h-20 sm:w-32"
                  />

                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <h3 className="truncate font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#2464cc]">
                      {project.category}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {project.gallery?.length || 0} image
                      {(project.gallery?.length || 0) > 1
                        ? "s"
                        : ""}{" "}
                      galerie
                    </p>
                  </div>

                  {/* ORDER */}

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() =>
                        moveProject(
                          index,
                          "up"
                        )
                      }
                      className="rounded-lg border border-gray-200 px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700"
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        sortedProjects.length - 1
                      }
                      onClick={() =>
                        moveProject(
                          index,
                          "down"
                        )
                      }
                      className="rounded-lg border border-gray-200 px-2.5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700"
                    >
                      ↓
                    </button>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(project)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Pencil size={16} />

                      <span className="hidden md:inline">
                        Modifier
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteProject(
                          project._id
                        )
                      }
                      disabled={
                        deletingProject ===
                        project._id
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:hover:bg-red-950/20"
                    >
                      {deletingProject ===
                      project._id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      <span className="hidden md:inline">
                        {deletingProject ===
                        project._id
                          ? "Suppression..."
                          : "Supprimer"}
                      </span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealisationsManagement;