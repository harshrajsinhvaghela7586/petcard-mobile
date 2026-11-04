export type LangCode = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";
export const LANGS: { code: LangCode; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिन्दी" },
    { code: "es", label: "Spanish", native: "Español" },
    { code: "fr", label: "French", native: "Français" },
    { code: "de", label: "German", native: "Deutsch" },
    { code: "nl", label: "Dutch", native: "Nederlands" },
    { code: "it", label: "Italian", native: "Italiano" },
];

const en = {
    "nav.home": "Home", "nav.tasks": "Tasks", "nav.know": "Know", "nav.profile": "Profile",
    "home.greeting": "Good morning, {name}! 👋", "home.howIs": "How's {pet} today?", "home.pawPoints": "Paw Points",
    "home.todayTasks": "Today's Tasks", "home.upcoming": "Upcoming", "home.viewAll": "View All", "home.viewCalendar": "View Calendar",
    "home.noTasks": "No tasks scheduled for today. Add a task to get started.", "home.noUpcoming": "No upcoming health records.",
    "home.dayStreak": "Day Streak", "stat.food": "Food", "stat.water": "Water", "stat.activity": "Activity", "stat.care": "Care Score",
    "quick.addTask": "Add Task", "quick.scanQr": "Scan QR", "quick.clicker": "Clicker", "quick.whistle": "Whistle", "quick.aiChat": "AI Chat",
    "nopet.title": "Pet setup is pending", "nopet.body": "Add your pet first to use tasks, calendar, food, water, health records and more.",
    "nopet.cta": "Complete Now", "nopet.later": "Maybe later",
    "settings.language": "App Language", "settings.chooseLanguage": "Choose language",
    "common.save": "Save", "common.cancel": "Cancel", "common.done": "Done",
};
export type StrKey = keyof typeof en;

const hi: Record<StrKey, string> = {
    "nav.home": "होम", "nav.tasks": "कार्य", "nav.know": "जानें", "nav.profile": "प्रोफ़ाइल",
    "home.greeting": "नमस्ते, {name}! 👋", "home.howIs": "{pet} आज कैसा है?", "home.pawPoints": "पॉ पॉइंट्स",
    "home.todayTasks": "आज के कार्य", "home.upcoming": "आने वाले", "home.viewAll": "सभी देखें", "home.viewCalendar": "कैलेंडर देखें",
    "home.noTasks": "आज कोई कार्य नहीं है। शुरू करने के लिए कार्य जोड़ें।", "home.noUpcoming": "कोई आने वाला हेल्थ रिकॉर्ड नहीं।",
    "home.dayStreak": "दिन की स्ट्रीक", "stat.food": "भोजन", "stat.water": "पानी", "stat.activity": "गतिविधि", "stat.care": "केयर स्कोर",
    "quick.addTask": "कार्य जोड़ें", "quick.scanQr": "QR स्कैन", "quick.clicker": "क्लिकर", "quick.whistle": "सीटी", "quick.aiChat": "AI चैट",
    "nopet.title": "पेट सेटअप बाकी है", "nopet.body": "कार्य, कैलेंडर, भोजन, पानी और हेल्थ रिकॉर्ड के लिए पहले अपना पेट जोड़ें।",
    "nopet.cta": "अभी पूरा करें", "nopet.later": "बाद में",
    "settings.language": "ऐप की भाषा", "settings.chooseLanguage": "भाषा चुनें",
    "common.save": "सेव करें", "common.cancel": "रद्द करें", "common.done": "हो गया",
};
const es: Record<StrKey, string> = {
    "nav.home": "Inicio", "nav.tasks": "Tareas", "nav.know": "Aprende", "nav.profile": "Perfil",
    "home.greeting": "¡Buenos días, {name}! 👋", "home.howIs": "¿Cómo está {pet} hoy?", "home.pawPoints": "Puntos Paw",
    "home.todayTasks": "Tareas de hoy", "home.upcoming": "Próximos", "home.viewAll": "Ver todo", "home.viewCalendar": "Ver calendario",
    "home.noTasks": "No hay tareas para hoy. Añade una para empezar.", "home.noUpcoming": "No hay registros de salud próximos.",
    "home.dayStreak": "Días de racha", "stat.food": "Comida", "stat.water": "Agua", "stat.activity": "Actividad", "stat.care": "Puntuación",
    "quick.addTask": "Añadir tarea", "quick.scanQr": "Escanear QR", "quick.clicker": "Clicker", "quick.whistle": "Silbato", "quick.aiChat": "Chat IA",
    "nopet.title": "Falta configurar tu mascota", "nopet.body": "Añade primero tu mascota para usar tareas, calendario, comida, agua y registros de salud.",
    "nopet.cta": "Completar ahora", "nopet.later": "Quizás luego",
    "settings.language": "Idioma de la app", "settings.chooseLanguage": "Elegir idioma",
    "common.save": "Guardar", "common.cancel": "Cancelar", "common.done": "Listo",
};
const fr: Record<StrKey, string> = {
    "nav.home": "Accueil", "nav.tasks": "Tâches", "nav.know": "Savoir", "nav.profile": "Profil",
    "home.greeting": "Bonjour, {name} ! 👋", "home.howIs": "Comment va {pet} aujourd'hui ?", "home.pawPoints": "Points Paw",
    "home.todayTasks": "Tâches du jour", "home.upcoming": "À venir", "home.viewAll": "Tout voir", "home.viewCalendar": "Voir le calendrier",
    "home.noTasks": "Aucune tâche aujourd'hui. Ajoutez-en une pour commencer.", "home.noUpcoming": "Aucun dossier de santé à venir.",
    "home.dayStreak": "Jours de suite", "stat.food": "Nourriture", "stat.water": "Eau", "stat.activity": "Activité", "stat.care": "Score de soins",
    "quick.addTask": "Ajouter", "quick.scanQr": "Scanner QR", "quick.clicker": "Clicker", "quick.whistle": "Sifflet", "quick.aiChat": "Chat IA",
    "nopet.title": "Configuration de l'animal en attente", "nopet.body": "Ajoutez d'abord votre animal pour utiliser les tâches, le calendrier, la nourriture, l'eau et la santé.",
    "nopet.cta": "Terminer maintenant", "nopet.later": "Plus tard",
    "settings.language": "Langue de l'app", "settings.chooseLanguage": "Choisir la langue",
    "common.save": "Enregistrer", "common.cancel": "Annuler", "common.done": "Terminé",
};
const de: Record<StrKey, string> = {
    "nav.home": "Start", "nav.tasks": "Aufgaben", "nav.know": "Wissen", "nav.profile": "Profil",
    "home.greeting": "Guten Morgen, {name}! 👋", "home.howIs": "Wie geht's {pet} heute?", "home.pawPoints": "Paw-Punkte",
    "home.todayTasks": "Heutige Aufgaben", "home.upcoming": "Demnächst", "home.viewAll": "Alle ansehen", "home.viewCalendar": "Kalender ansehen",
    "home.noTasks": "Heute keine Aufgaben. Füge eine hinzu, um zu starten.", "home.noUpcoming": "Keine anstehenden Gesundheitseinträge.",
    "home.dayStreak": "Tage in Folge", "stat.food": "Futter", "stat.water": "Wasser", "stat.activity": "Aktivität", "stat.care": "Pflege-Score",
    "quick.addTask": "Aufgabe", "quick.scanQr": "QR scannen", "quick.clicker": "Clicker", "quick.whistle": "Pfeife", "quick.aiChat": "KI-Chat",
    "nopet.title": "Haustier-Einrichtung offen", "nopet.body": "Füge zuerst dein Haustier hinzu, um Aufgaben, Kalender, Futter, Wasser und Gesundheit zu nutzen.",
    "nopet.cta": "Jetzt abschließen", "nopet.later": "Später",
    "settings.language": "App-Sprache", "settings.chooseLanguage": "Sprache wählen",
    "common.save": "Speichern", "common.cancel": "Abbrechen", "common.done": "Fertig",
};
const nl: Record<StrKey, string> = {
    "nav.home": "Home", "nav.tasks": "Taken", "nav.know": "Weten", "nav.profile": "Profiel",
    "home.greeting": "Goedemorgen, {name}! 👋", "home.howIs": "Hoe is het met {pet} vandaag?", "home.pawPoints": "Paw-punten",
    "home.todayTasks": "Taken van vandaag", "home.upcoming": "Binnenkort", "home.viewAll": "Alles bekijken", "home.viewCalendar": "Agenda bekijken",
    "home.noTasks": "Geen taken vandaag. Voeg er een toe om te beginnen.", "home.noUpcoming": "Geen aankomende gezondheidsrecords.",
    "home.dayStreak": "Dagen op rij", "stat.food": "Eten", "stat.water": "Water", "stat.activity": "Activiteit", "stat.care": "Zorgscore",
    "quick.addTask": "Taak", "quick.scanQr": "QR scannen", "quick.clicker": "Clicker", "quick.whistle": "Fluitje", "quick.aiChat": "AI-chat",
    "nopet.title": "Huisdier instellen nog open", "nopet.body": "Voeg eerst je huisdier toe om taken, agenda, eten, water en gezondheid te gebruiken.",
    "nopet.cta": "Nu afronden", "nopet.later": "Later",
    "settings.language": "App-taal", "settings.chooseLanguage": "Kies taal",
    "common.save": "Opslaan", "common.cancel": "Annuleren", "common.done": "Klaar",
};
const it: Record<StrKey, string> = {
    "nav.home": "Home", "nav.tasks": "Attività", "nav.know": "Scopri", "nav.profile": "Profilo",
    "home.greeting": "Buongiorno, {name}! 👋", "home.howIs": "Come sta {pet} oggi?", "home.pawPoints": "Punti Paw",
    "home.todayTasks": "Attività di oggi", "home.upcoming": "In arrivo", "home.viewAll": "Vedi tutto", "home.viewCalendar": "Vedi calendario",
    "home.noTasks": "Nessuna attività oggi. Aggiungine una per iniziare.", "home.noUpcoming": "Nessun record sanitario in arrivo.",
    "home.dayStreak": "Giorni di fila", "stat.food": "Cibo", "stat.water": "Acqua", "stat.activity": "Attività", "stat.care": "Punteggio cura",
    "quick.addTask": "Aggiungi", "quick.scanQr": "Scansiona QR", "quick.clicker": "Clicker", "quick.whistle": "Fischietto", "quick.aiChat": "Chat IA",
    "nopet.title": "Configurazione animale in sospeso", "nopet.body": "Aggiungi prima il tuo animale per usare attività, calendario, cibo, acqua e salute.",
    "nopet.cta": "Completa ora", "nopet.later": "Più tardi",
    "settings.language": "Lingua dell'app", "settings.chooseLanguage": "Scegli lingua",
    "common.save": "Salva", "common.cancel": "Annulla", "common.done": "Fatto",
};

export const STRINGS: Record<LangCode, Record<StrKey, string>> = { en, hi, es, fr, de, nl, it };
