const fs = require('fs');

const langs = ['az', 'en', 'ru', 'arb'];

const translations = {
  az: {
    carTable: {
      headers: { image: "Şəkil", name: "Ad", type: "Tip", price: "Qiymət", description: "Təsvir", actions: "Əməliyyat" },
      modal: { confirmDelete: "Bu avtomobili silmək istədiyinizə əminsiniz?", cancel: "Ləğv et", delete: "Sil", deleting: "Silinir..." },
      toast: { deleteSuccess: "Avtomobil uğurla silindi", deleteError: "Xəta baş verdi" }
    },
    carAdd: {
      breadcrumb: { root: "Avtomobillər", current: "Yeni avtomobil" },
      title: "Avtomobil əlavə et",
      description: "Yeni avtomobil məlumatlarını daxil edin",
      sections: {
        name: { title: "Avtomobilin adı", desc: "Avtomobilin adını bütün dillərdə daxil edin", placeholders: { az: "Ad (AZ)", ru: "Ad (RU)", en: "Ad (EN)", de: "Ad (DE)", ar: "Ad (AR)" } },
        typePrice: { title: "Tip və Qiymət", desc: "Avtomobilin növünü və qiymətini daxil edin", placeholders: { type: "Tip (məs: Sedan, SUV, Van...)", price: "Qiymət (məs: 150 AZN/gün)" } },
        cardImage: { title: "Əsas Şəkil (Card Image)", desc: "Avtomobilin əsas şəklini yükləyin" },
        images: { title: "Şəkillər", desc: "Avtomobilin digər şəkillərini yükləyin", uploadedLength: "Yüklənmiş şəkillər" },
        videos: { title: "Videolar", desc: "Video URL-lərini əlavə edin", placeholder: "Video URL daxil edin", addBtn: "Əlavə et" },
        description: { title: "Təsvir", desc: "Avtomobilin təsvirini bütün dillərdə daxil edin", placeholders: { az: "Təsvir (AZ)", ru: "Təsvir (RU)", en: "Təsvir (EN)", de: "Təsvir (DE)", ar: "Təsvir (AR)" } }
      },
      buttons: { save: "Yadda saxla", saving: "Yüklənir..." },
      toast: { success: "Avtomobil uğurla əlavə edildi", error: "Xəta baş verdi", warnNameAz: "Ad daxil edin (AZ)" },
      uploadHint: "Şəkil seçin və ya sürükləyin"
    },
    carEdit: {
      breadcrumb: { root: "Avtomobillər", current: "Avtomobilə düzəliş et" },
      title: "Avtomobilə düzəliş et",
      description: "Avtomobil məlumatlarını yeniləyin",
      sections: {
        name: { title: "Avtomobilin adı", desc: "Avtomobilin adını bütün dillərdə daxil edin", placeholders: { az: "Ad (AZ)", ru: "Ad (RU)", en: "Ad (EN)", de: "Ad (DE)", ar: "Ad (AR)" } },
        typePrice: { title: "Tip və Qiymət", desc: "Avtomobilin növünü və qiymətini daxil edin", placeholders: { type: "Tip", price: "Qiymət" } },
        cardImage: { title: "Əsas Şəkil (Card Image)", desc: "Avtomobilin əsas şəklini yükləyin", oldImage: "Mövcud Əsas Şəkil" },
        images: { title: "Şəkillər", desc: "Avtomobilin digər şəkillərini yükləyin", uploadedLength: "Yüklənmiş şəkillər" },
        videos: { title: "Videolar", desc: "Video URL-lərini əlavə edin", placeholder: "Video URL daxil edin", addBtn: "Əlavə et" },
        description: { title: "Təsvir", desc: "Avtomobilin təsvirini bütün dillərdə daxil edin", placeholders: { az: "Təsvir (AZ)", ru: "Təsvir (RU)", en: "Təsvir (EN)", de: "Təsvir (DE)", ar: "Təsvir (AR)" } }
      },
      buttons: { save: "Yadda saxla", saving: "Yüklənir..." },
      toast: { success: "Yalnız dəyişən məlumatlar uğurla göndərildi", error: "Xəta baş verdi", warnNameAz: "Ad daxil edin (AZ)" },
      uploadHint: "Şəkil seçin və ya sürükləyin"
    },
    newspaperTable: {
      headers: { image: "Şəkil", title: "Başlıq", subtitle: "Məzmun", actions: "Əməliyyat" },
      modal: { confirmDelete: "Bu xəbəri silmək istədiyinizə əminsiniz?", cancel: "Ləğv et", delete: "Sil", deleting: "Silinir..." },
      toast: { deleteSuccess: "Xəbər uğurla silindi", deleteError: "Xəta baş verdi" }
    },
    newspaperAdd: {
      breadcrumb: { root: "Xəbərlər", current: "Yeni xəbər" },
      title: "Xəbər əlavə et",
      description: "Yeni xəbər / qəzet məlumatlarını daxil edin",
      sections: {
        title: { title: "Xəbərin başlığı", desc: "Xəbərin başlığını bütün dillərdə daxil edin", placeholders: { az: "Başlıq (AZ)", ru: "Başlıq (RU)", en: "Başlıq (EN)", de: "Başlıq (DE)", ar: "Başlıq (AR)" } },
        images: { title: "Şəkillər", desc: "Xəbərin şəkillərini yükləyin", uploadedLength: "Yüklənmiş şəkillər" },
        subtitle: { title: "Alt Başlıq / Məzmun", desc: "Xəbərin mətnini bütün dillərdə daxil edin", placeholders: { az: "Məzmun (AZ)", ru: "Məzmun (RU)", en: "Məzmun (EN)", de: "Məzmun (DE)", ar: "Məzmun (AR)" } }
      },
      buttons: { save: "Yadda saxla", saving: "Yüklənir..." },
      toast: { success: "Xəbər uğurla əlavə edildi", error: "Xəta baş verdi", warnAz: "Başlıq daxil edin (AZ)" },
      uploadHint: "Şəkil seçin və ya sürükləyin"
    },
    newspaperEdit: {
      breadcrumb: { root: "Xəbərlər", current: "Xəbərə düzəliş et" },
      title: "Xəbərə düzəliş et",
      description: "Mövcud xəbərə düzəliş edin",
      sections: {
        title: { title: "Xəbərin başlığı", desc: "Xəbərin başlığını bütün dillərdə daxil edin", placeholders: { az: "Başlıq (AZ)", ru: "Başlıq (RU)", en: "Başlıq (EN)", de: "Başlıq (DE)", ar: "Başlıq (AR)" } },
        images: { title: "Şəkillər", desc: "Xəbərin şəkillərini yükləyin", uploadedLength: "Yüklənmiş şəkillər" },
        subtitle: { title: "Alt Başlıq / Məzmun", desc: "Xəbərin mətnini bütün dillərdə daxil edin", placeholders: { az: "Məzmun (AZ)", ru: "Məzmun (RU)", en: "Məzmun (EN)", de: "Məzmun (DE)", ar: "Məzmun (AR)" } }
      },
      buttons: { save: "Yadda saxla", saving: "Yüklənir..." },
      toast: { success: "Dəyişikliklər uğurla yadda saxlanıldı", error: "Xəta baş verdi", warnAz: "Başlıq daxil edin (AZ)" },
      uploadHint: "Şəkil seçin və ya sürükləyin"
    }
  },
  en: {
    carTable: { headers: { image: "Image", name: "Name", type: "Type", price: "Price", description: "Description", actions: "Actions" }, modal: { confirmDelete: "Are you sure you want to delete this car?", cancel: "Cancel", delete: "Delete", deleting: "Deleting..." }, toast: { deleteSuccess: "Car deleted successfully", deleteError: "An error occurred" } },
    carAdd: { breadcrumb: { root: "Cars", current: "New car" }, title: "Add Car", description: "Enter new car details", sections: { name: { title: "Car Name", desc: "Enter car name in all languages", placeholders: { az: "Name (AZ)", ru: "Name (RU)", en: "Name (EN)", de: "Name (DE)", ar: "Name (AR)" } }, typePrice: { title: "Type & Price", desc: "Enter car type and price", placeholders: { type: "Type (e.g., Sedan, SUV)", price: "Price" } }, cardImage: { title: "Main Graphic", desc: "Upload main car image" }, images: { title: "Images", desc: "Upload additional images", uploadedLength: "Uploaded Images" }, videos: { title: "Videos", desc: "Add video URLs", placeholder: "Enter Video URL", addBtn: "Add" }, description: { title: "Description", desc: "Enter car description", placeholders: { az: "Desc (AZ)", ru: "Desc (RU)", en: "Desc (EN)", de: "Desc (DE)", ar: "Desc (AR)" } } }, buttons: { save: "Save", saving: "Saving..." }, toast: { success: "Car added successfully", error: "An error occurred", warnNameAz: "Enter Name (AZ)" }, uploadHint: "Click or drag images here" },
    carEdit: { breadcrumb: { root: "Cars", current: "Edit car" }, title: "Edit Car", description: "Update car details", sections: { name: { title: "Car Name", desc: "Enter car name in all languages", placeholders: { az: "Name (AZ)", ru: "Name (RU)", en: "Name (EN)", de: "Name (DE)", ar: "Name (AR)" } }, typePrice: { title: "Type & Price", desc: "Enter car type and price", placeholders: { type: "Type", price: "Price" } }, cardImage: { title: "Main Graphic", desc: "Upload main car image", oldImage: "Current Main Image" }, images: { title: "Images", desc: "Upload additional images", uploadedLength: "Uploaded Images" }, videos: { title: "Videos", desc: "Add video URLs", placeholder: "Enter Video URL", addBtn: "Add" }, description: { title: "Description", desc: "Enter car description", placeholders: { az: "Desc (AZ)", ru: "Desc (RU)", en: "Desc (EN)", de: "Desc (DE)", ar: "Desc (AR)" } } }, buttons: { save: "Save", saving: "Saving..." }, toast: { success: "Only updated fields were sent successfully", error: "An error occurred", warnNameAz: "Enter Name (AZ)" }, uploadHint: "Click or drag images here" },
    newspaperTable: { headers: { image: "Image", title: "Title", subtitle: "Content", actions: "Actions" }, modal: { confirmDelete: "Are you sure you want to delete this news?", cancel: "Cancel", delete: "Delete", deleting: "Deleting..." }, toast: { deleteSuccess: "News deleted successfully", deleteError: "An error occurred" } },
    newspaperAdd: { breadcrumb: { root: "News", current: "New news" }, title: "Add News", description: "Enter news data", sections: { title: { title: "News Title", desc: "Enter title in all languages", placeholders: { az: "Title (AZ)", ru: "Title (RU)", en: "Title (EN)", de: "Title (DE)", ar: "Title (AR)" } }, images: { title: "Images", desc: "Upload images", uploadedLength: "Uploaded images" }, subtitle: { title: "Subtitle / Content", desc: "Enter news content", placeholders: { az: "Content (AZ)", ru: "Content (RU)", en: "Content (EN)", de: "Content (DE)", ar: "Content (AR)" } } }, buttons: { save: "Save", saving: "Saving..." }, toast: { success: "News added successfully", error: "An error occurred", warnAz: "Enter title (AZ)" }, uploadHint: "Click or drag to upload" },
    newspaperEdit: { breadcrumb: { root: "News", current: "Edit news" }, title: "Edit News", description: "Update news data", sections: { title: { title: "News Title", desc: "Enter title in all languages", placeholders: { az: "Title (AZ)", ru: "Title (RU)", en: "Title (EN)", de: "Title (DE)", ar: "Title (AR)" } }, images: { title: "Images", desc: "Upload images", uploadedLength: "Uploaded images" }, subtitle: { title: "Subtitle / Content", desc: "Enter news content", placeholders: { az: "Content (AZ)", ru: "Content (RU)", en: "Content (EN)", de: "Content (DE)", ar: "Content (AR)" } } }, buttons: { save: "Save", saving: "Saving..." }, toast: { success: "Changes saved successfully", error: "An error occurred", warnAz: "Enter title (AZ)" }, uploadHint: "Click or drag to upload" }
  },
  ru: {
    carTable: { headers: { image: "Изображение", name: "Название", type: "Тип", price: "Цена", description: "Описание", actions: "Действия" }, modal: { confirmDelete: "Вы уверены, что хотите удалить этот автомобиль?", cancel: "Отмена", delete: "Удалить", deleting: "Удаление..." }, toast: { deleteSuccess: "Автомобиль успешно удален", deleteError: "Произошла ошибка" } },
    carAdd: { breadcrumb: { root: "Автомобили", current: "Новый автомобиль" }, title: "Добавить автомобиль", description: "Введите данные автомобиля", sections: { name: { title: "Название автомобиля", desc: "Введите название во всех языках", placeholders: { az: "Название (AZ)", ru: "Название (RU)", en: "Название (EN)", de: "Название (DE)", ar: "Название (AR)" } }, typePrice: { title: "Тип и Цена", desc: "Введите тип и цену", placeholders: { type: "Тип", price: "Цена" } }, cardImage: { title: "Главое изображение", desc: "Загрузите изображение" }, images: { title: "Изображения", desc: "Загрузите дополнительные изображения", uploadedLength: "Загруженные изображения" }, videos: { title: "Видео", desc: "Добавьте видео URL", placeholder: "Введите видео URL", addBtn: "Добавить" }, description: { title: "Описание", desc: "Введите описание во всех языках", placeholders: { az: "Описание (AZ)", ru: "Описание (RU)", en: "Описание (EN)", de: "Описание (DE)", ar: "Описание (AR)" } } }, buttons: { save: "Сохранить", saving: "Сохранение..." }, toast: { success: "Авто успешно добавлено", error: "Произошла ошибка", warnNameAz: "Введите название (AZ)" }, uploadHint: "Нажмите или перетащите файл" },
    carEdit: { breadcrumb: { root: "Автомобили", current: "Редактировать автомобиль" }, title: "Редактировать автомобиль", description: "Обновите данные", sections: { name: { title: "Название", desc: "Введите название", placeholders: { az: "Название (AZ)", ru: "Название (RU)", en: "Название (EN)", de: "Название (DE)", ar: "Название (AR)" } }, typePrice: { title: "Тип и Цена", desc: "Введите тип и цену", placeholders: { type: "Тип", price: "Цена" } }, cardImage: { title: "Главное изображение", desc: "Загрузите изображение", oldImage: "Текущее изображение" }, images: { title: "Изображения", desc: "Загрузите дополнительные изображения", uploadedLength: "Загруженные" }, videos: { title: "Видео", desc: "Вставьте URL", placeholder: "URL видео", addBtn: "Вставить" }, description: { title: "Описание", desc: "Описание", placeholders: { az: "Описание (AZ)", ru: "Описание (RU)", en: "Описание (EN)", de: "Описание (DE)", ar: "Описание (AR)" } } }, buttons: { save: "Сохранить", saving: "Обновление..." }, toast: { success: "Данные успешно обновлены", error: "Произошла ошибка", warnNameAz: "Введите Название (AZ)" }, uploadHint: "Нажмите или перетащите" },
    newspaperTable: { headers: { image: "Фото", title: "Заголовок", subtitle: "Контент", actions: "Действия" }, modal: { confirmDelete: "Удалить эту новость?", cancel: "Отмена", delete: "Удалить", deleting: "Удаление..." }, toast: { deleteSuccess: "Новость удалена", deleteError: "Ошибка" } },
    newspaperAdd: { breadcrumb: { root: "Новости", current: "Новая новость" }, title: "Добавить", description: "Добавить новость", sections: { title: { title: "Заголовок", desc: "Введите заголовок", placeholders: { az: "Заголовок (AZ)", ru: "Заголовок (RU)", en: "Заголовок (EN)", de: "Заголовок (DE)", ar: "Заголовок (AR)" } }, images: { title: "Фото", desc: "Загрузите фото", uploadedLength: "Загружено" }, subtitle: { title: "Контент", desc: "Содержание", placeholders: { az: "Контент (AZ)", ru: "Контент (RU)", en: "Контент (EN)", de: "Контент (DE)", ar: "Контент (AR)" } } }, buttons: { save: "Сохранить", saving: "Загрузка..." }, toast: { success: "Успешно добавлено", error: "Ошибка", warnAz: "Введите Заголовок (AZ)" }, uploadHint: "Перетащите файлы" },
    newspaperEdit: { breadcrumb: { root: "Новости", current: "Редактировать" }, title: "Редактировать", description: "Редактировать новость", sections: { title: { title: "Заголовок", desc: "Введите заголовок", placeholders: { az: "Заголовок (AZ)", ru: "Заголовок (RU)", en: "Заголовок (EN)", de: "Заголовок (DE)", ar: "Заголовок (AR)" } }, images: { title: "Фото", desc: "Загрузите фото", uploadedLength: "Загруженные" }, subtitle: { title: "Контент", desc: "Содержание", placeholders: { az: "Контент (AZ)", ru: "Контент (RU)", en: "Контент (EN)", de: "Контент (DE)", ar: "Контент (AR)" } } }, buttons: { save: "Сохранить", saving: "Загрузка..." }, toast: { success: "Успешно сохранено", error: "Ошибка", warnAz: "Заголовок (AZ)" }, uploadHint: "Перетащите файлы" }
  },
  arb: {
    carTable: { headers: { image: "صورة", name: "اسم", type: "نوع", price: "السعر", description: "الوصف", actions: "عمليات" }, modal: { confirmDelete: "هل أنت متأكد أنك تريد حذف هذه السيارة؟", cancel: "إلغاء", delete: "حذف", deleting: "حذف..." }, toast: { deleteSuccess: "تم الحذف", deleteError: "حدث خطأ" } },
    carAdd: { breadcrumb: { root: "السيارات", current: "سيارة جديدة" }, title: "إضافة سيارة", description: "أدخل تفاصيل السيارة", sections: { name: { title: "اسم السيارة", desc: "أدخل الاسم", placeholders: { az: "الاسم (AZ)", ru: "الاسم (RU)", en: "الاسم (EN)", de: "الاسم (DE)", ar: "الاسم (AR)" } }, typePrice: { title: "النوع والسعر", desc: "النوع والسعر", placeholders: { type: "النوع", price: "السعر" } }, cardImage: { title: "الصورة الرئيسية", desc: "الجرافيك الأساسي" }, images: { title: "الصور", desc: "تحميل الصور", uploadedLength: "تم التحميل" }, videos: { title: "فيديو", desc: "إضافة فيديو", placeholder: "رابط", addBtn: "إضافة" }, description: { title: "الوصف", desc: "الوصف", placeholders: { az: "الوصف (AZ)", ru: "الوصف (RU)", en: "الوصف (EN)", de: "الوصف (DE)", ar: "الوصف (AR)" } } }, buttons: { save: "حفظ", saving: "تحميل..." }, toast: { success: "تمت الإضافة بنجاح", error: "حدث خطأ", warnNameAz: "إدخال الاسم" }, uploadHint: "انقر أو اسحب" },
    carEdit: { breadcrumb: { root: "السيارات", current: "تعديل" }, title: "تعديل", description: "تعديل", sections: { name: { title: "الاسم", desc: "الاسم", placeholders: { az: "الاسم (AZ)", ru: "الاسم (RU)", en: "الاسم (EN)", de: "الاسم (DE)", ar: "الاسم (AR)" } }, typePrice: { title: "النوع", desc: "النوع والسعر", placeholders: { type: "النوع", price: "السعر" } }, cardImage: { title: "الصورة", desc: "الصورة", oldImage: "الصورة القديمة" }, images: { title: "الصور", desc: "الصور", uploadedLength: "مرفوعة" }, videos: { title: "فيديوهات", desc: "إضافة فيديو", placeholder: "رابط", addBtn: "أضف" }, description: { title: "الوصف", desc: "الوصف", placeholders: { az: "الوصف (AZ)", ru: "الوصف (RU)", en: "الوصف (EN)", de: "الوصف (DE)", ar: "الوصف (AR)" } } }, buttons: { save: "حفظ", saving: "تحديث..." }, toast: { success: "تم التعديل", error: "خطأ", warnNameAz: "أدخل الاسم" }, uploadHint: "انقر أو اسحب للصورة" },
    newspaperTable: { headers: { image: "صورة", title: "عنوان", subtitle: "محتوى", actions: "عمليات" }, modal: { confirmDelete: "حذف الأخبار؟", cancel: "إلغاء", delete: "حذف", deleting: "جار الحذف..." }, toast: { deleteSuccess: "تم الحذف", deleteError: "خطأ" } },
    newspaperAdd: { breadcrumb: { root: "أخبار", current: "جديد" }, title: "إضافة أخبار", description: "إضافة أخبار", sections: { title: { title: "العنوان", desc: "العنوان", placeholders: { az: "العنوان", ru: "العنوان", en: "العنوان", de: "العنوان", ar: "العنوان" } }, images: { title: "الصور", desc: "رفع الصور", uploadedLength: "تم الرفع" }, subtitle: { title: "المحتوى", desc: "وصف", placeholders: { az: "المحتوى", ru: "المحتوى", en: "المحتوى", de: "المحتوى", ar: "المحتوى" } } }, buttons: { save: "حفظ", saving: "يتم الرفع..." }, toast: { success: "تم بنجاح", error: "خطأ", warnAz: "أدخل العنوان" }, uploadHint: "اسحب ملفا" },
    newspaperEdit: { breadcrumb: { root: "أخبار", current: "تعديل" }, title: "تعديل الأخبار", description: "تعديل", sections: { title: { title: "العنوان", desc: "العنوان", placeholders: { az: "العنوان", ru: "العنوان", en: "العنوان", de: "العنوان", ar: "العنوان" } }, images: { title: "الصور", desc: "رفع الصور", uploadedLength: "تم الرفع" }, subtitle: { title: "المحتوى", desc: "وصف", placeholders: { az: "المحتوى", ru: "المحتوى", en: "المحتوى", de: "المحتوى", ar: "المحتوى" } } }, buttons: { save: "حفظ", saving: "يتم الحفظ..." }, toast: { success: "تم بنجاح", error: "خطأ", warnAz: "العنوان" }, uploadHint: "اسحب ملفا" }
  }
};

langs.forEach(lang => {
  const filePath = `c:/Users/zulfu/OneDrive/Desktop/FrontEnd/Kliniken-Allianz/public/locales/${lang}/translation.json`;
  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);
  Object.assign(data.adminPanel, translations[lang]);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("Translations successfully patched!");
