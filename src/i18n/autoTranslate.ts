import React, { useSyncExternalStore } from "react";
import { Alert } from "react-native";
import { api } from "@/services/apiClient";

/*
 * Translates the app's fixed English labels at render time, so every screen follows the chosen language
 * without touching each file. Only exact, whole-string matches are replaced; names, dates and
 * anything typed by the user are never changed. Missing words simply stay in English.
 * To add a word: add one row below  "English": [hi, es, fr, de, nl, it].
 */
export type TLang = "en" | "hi" | "es" | "fr" | "de" | "nl" | "it";
const ORDER: TLang[] = ["hi", "es", "fr", "de", "nl", "it"];

const D: Record<string, string[]> = {
  "View All": ["सभी देखें", "Ver todo", "Tout voir", "Alle ansehen", "Alles bekijken", "Vedi tutto"],
  "Cancel": ["रद्द करें", "Cancelar", "Annuler", "Abbrechen", "Annuleren", "Annulla"],
  "Done": ["हो गया", "Listo", "Terminé", "Fertig", "Klaar", "Fatto"],
  "Save": ["सेव करें", "Guardar", "Enregistrer", "Speichern", "Opslaan", "Salva"],
  "Edit": ["संपादित करें", "Editar", "Modifier", "Bearbeiten", "Bewerken", "Modifica"],
  "Edit Profile": ["प्रोफ़ाइल संपादित करें", "Editar perfil", "Modifier le profil", "Profil bearbeiten", "Profiel bewerken", "Modifica profilo"],
  "Delete": ["हटाएं", "Eliminar", "Supprimer", "Löschen", "Verwijderen", "Elimina"],
  "Skip": ["छोड़ें", "Omitir", "Passer", "Überspringen", "Overslaan", "Salta"],
  "Skip for now": ["अभी छोड़ें", "Omitir por ahora", "Passer pour l'instant", "Vorerst überspringen", "Nu overslaan", "Salta per ora"],
  "Continue": ["जारी रखें", "Continuar", "Continuer", "Weiter", "Doorgaan", "Continua"],
  "Next": ["आगे", "Siguiente", "Suivant", "Weiter", "Volgende", "Avanti"],
  "Back": ["वापस", "Atrás", "Retour", "Zurück", "Terug", "Indietro"],
  "Login": ["लॉग इन", "Iniciar sesión", "Connexion", "Anmelden", "Inloggen", "Accedi"],
  "Log In": ["लॉग इन", "Iniciar sesión", "Connexion", "Anmelden", "Inloggen", "Accedi"],
  "Sign Up": ["साइन अप", "Registrarse", "S'inscrire", "Registrieren", "Aanmelden", "Registrati"],
  "Logout": ["लॉग आउट", "Cerrar sesión", "Déconnexion", "Abmelden", "Uitloggen", "Esci"],
  "Email": ["ईमेल", "Correo electrónico", "E-mail", "E-Mail", "E-mail", "Email"],
  "Password": ["पासवर्ड", "Contraseña", "Mot de passe", "Passwort", "Wachtwoord", "Password"],
  "Phone Number": ["फ़ोन नंबर", "Número de teléfono", "Numéro de téléphone", "Telefonnummer", "Telefoonnummer", "Numero di telefono"],
  "Full Name": ["पूरा नाम", "Nombre completo", "Nom complet", "Vollständiger Name", "Volledige naam", "Nome completo"],
  "Home": ["होम", "Inicio", "Accueil", "Startseite", "Home", "Home"],
  "Tasks": ["कार्य", "Tareas", "Tâches", "Aufgaben", "Taken", "Attività"],
  "Know": ["जानें", "Aprende", "Savoir", "Wissen", "Weten", "Scopri"],
  "Profile": ["प्रोफ़ाइल", "Perfil", "Profil", "Profil", "Profiel", "Profilo"],
  "Settings": ["सेटिंग्स", "Ajustes", "Paramètres", "Einstellungen", "Instellingen", "Impostazioni"],
  "Notifications": ["सूचनाएं", "Notificaciones", "Notifications", "Benachrichtigungen", "Meldingen", "Notifiche"],
  "No notifications yet": ["अभी कोई सूचना नहीं", "Aún no hay notificaciones", "Aucune notification", "Noch keine Benachrichtigungen", "Nog geen meldingen", "Nessuna notifica"],
  "Today's Tasks": ["आज के कार्य", "Tareas de hoy", "Tâches du jour", "Heutige Aufgaben", "Taken van vandaag", "Attività di oggi"],
  "Upcoming": ["आने वाले", "Próximos", "À venir", "Anstehend", "Binnenkort", "In arrivo"],
  "Create Task": ["कार्य बनाएं", "Crear tarea", "Créer une tâche", "Aufgabe erstellen", "Taak maken", "Crea attività"],
  "Add Task": ["कार्य जोड़ें", "Añadir tarea", "Ajouter une tâche", "Aufgabe hinzufügen", "Taak toevoegen", "Aggiungi attività"],
  "Task History": ["कार्य इतिहास", "Historial de tareas", "Historique des tâches", "Aufgabenverlauf", "Taakgeschiedenis", "Cronologia attività"],
  "Task Completed": ["कार्य पूरा हुआ", "Tarea completada", "Tâche terminée", "Aufgabe erledigt", "Taak voltooid", "Attività completata"],
  "Completed": ["पूर्ण", "Completado", "Terminé", "Erledigt", "Voltooid", "Completato"],
  "Loading tasks...": ["कार्य लोड हो रहे हैं...", "Cargando tareas...", "Chargement des tâches...", "Aufgaben werden geladen...", "Taken laden...", "Caricamento attività..."],
  "Loading records...": ["रिकॉर्ड लोड हो रहे हैं...", "Cargando registros...", "Chargement des dossiers...", "Einträge werden geladen...", "Records laden...", "Caricamento registri..."],
  "Loading memories...": ["यादें लोड हो रही हैं...", "Cargando recuerdos...", "Chargement des souvenirs...", "Erinnerungen werden geladen...", "Herinneringen laden...", "Caricamento ricordi..."],
  "Health Record": ["हेल्थ रिकॉर्ड", "Registro de salud", "Dossier de santé", "Gesundheitsakte", "Gezondheidsdossier", "Cartella sanitaria"],
  "Health Records": ["हेल्थ रिकॉर्ड", "Registros de salud", "Dossiers de santé", "Gesundheitsakten", "Gezondheidsdossiers", "Cartelle sanitarie"],
  "Add Record": ["रिकॉर्ड जोड़ें", "Añadir registro", "Ajouter un dossier", "Eintrag hinzufügen", "Record toevoegen", "Aggiungi registro"],
  "Next Due": ["अगली देय तिथि", "Próximo vencimiento", "Prochaine échéance", "Nächste Fälligkeit", "Volgende vervaldatum", "Prossima scadenza"],
  "Memories": ["यादें", "Recuerdos", "Souvenirs", "Erinnerungen", "Herinneringen", "Ricordi"],
  "Add Memory": ["याद जोड़ें", "Añadir recuerdo", "Ajouter un souvenir", "Erinnerung hinzufügen", "Herinnering toevoegen", "Aggiungi ricordo"],
  "No memories yet. Add your first memory.": ["अभी कोई याद नहीं। अपनी पहली याद जोड़ें।", "Aún no hay recuerdos. Añade el primero.", "Aucun souvenir. Ajoutez le premier.", "Noch keine Erinnerungen. Füge die erste hinzu.", "Nog geen herinneringen. Voeg de eerste toe.", "Nessun ricordo. Aggiungi il primo."],
  "My Pets": ["मेरे पेट्स", "Mis mascotas", "Mes animaux", "Meine Tiere", "Mijn huisdieren", "I miei animali"],
  "Add Pet": ["पेट जोड़ें", "Añadir mascota", "Ajouter un animal", "Tier hinzufügen", "Huisdier toevoegen", "Aggiungi animale"],
  "Scan QR": ["QR स्कैन", "Escanear QR", "Scanner QR", "QR scannen", "QR scannen", "Scansiona QR"],
  "Achievements": ["उपलब्धियां", "Logros", "Succès", "Erfolge", "Prestaties", "Traguardi"],
  "Rewards": ["इनाम", "Recompensas", "Récompenses", "Belohnungen", "Beloningen", "Premi"],
  "Refer a Friend": ["दोस्त को रेफ़र करें", "Invita a un amigo", "Parrainer un ami", "Freund einladen", "Vriend uitnodigen", "Invita un amico"],
  "Your Referral Code": ["आपका रेफ़रल कोड", "Tu código de referido", "Votre code de parrainage", "Dein Empfehlungscode", "Jouw verwijscode", "Il tuo codice invito"],
  "Share Code": ["कोड शेयर करें", "Compartir código", "Partager le code", "Code teilen", "Code delen", "Condividi codice"],
  "How it works": ["यह कैसे काम करता है", "Cómo funciona", "Comment ça marche", "So funktioniert's", "Zo werkt het", "Come funziona"],
  "Guardians": ["अभिभावक", "Guardianes", "Gardiens", "Betreuer", "Voogden", "Tutori"],
  "Co-Guardians": ["सह-अभिभावक", "Co-guardianes", "Co-gardiens", "Mitbetreuer", "Mede-voogden", "Co-tutori"],
  "Primary Guardian": ["मुख्य अभिभावक", "Guardián principal", "Gardien principal", "Hauptbetreuer", "Hoofdvoogd", "Tutore principale"],
  "Pending Approval": ["अनुमोदन लंबित", "Pendiente de aprobación", "En attente d'approbation", "Genehmigung ausstehend", "In afwachting van goedkeuring", "In attesa di approvazione"],
  "Reminders & Alerts": ["रिमाइंडर और अलर्ट", "Recordatorios y alertas", "Rappels et alertes", "Erinnerungen & Hinweise", "Herinneringen & meldingen", "Promemoria e avvisi"],
  "Notification tone": ["सूचना टोन", "Tono de notificación", "Sonnerie de notification", "Benachrichtigungston", "Meldingstoon", "Suoneria notifica"],
  "System default": ["सिस्टम डिफ़ॉल्ट", "Predeterminado del sistema", "Par défaut du système", "Systemstandard", "Systeemstandaard", "Predefinito di sistema"],
  "Vibrate": ["वाइब्रेट", "Vibrar", "Vibration", "Vibration", "Trillen", "Vibrazione"],
  "Off": ["बंद", "Desactivado", "Désactivé", "Aus", "Uit", "Spento"],
  "Short": ["छोटा", "Corto", "Court", "Kurz", "Kort", "Breve"],
  "Long": ["लंबा", "Largo", "Long", "Lang", "Lang", "Lungo"],
  "Default": ["डिफ़ॉल्ट", "Predeterminado", "Par défaut", "Standard", "Standaard", "Predefinito"],
  "Help & Support": ["मदद और सहायता", "Ayuda y soporte", "Aide et assistance", "Hilfe & Support", "Help & ondersteuning", "Aiuto e supporto"],
  "Privacy & Security": ["गोपनीयता और सुरक्षा", "Privacidad y seguridad", "Confidentialité et sécurité", "Datenschutz & Sicherheit", "Privacy & beveiliging", "Privacy e sicurezza"],
  "About": ["हमारे बारे में", "Acerca de", "À propos", "Über uns", "Over ons", "Informazioni"],
  "Contact Us": ["हमसे संपर्क करें", "Contáctanos", "Nous contacter", "Kontakt", "Contact", "Contattaci"],
  "Food": ["भोजन", "Comida", "Nourriture", "Futter", "Voer", "Cibo"],
  "Water": ["पानी", "Agua", "Eau", "Wasser", "Water", "Acqua"],
  "Activity": ["गतिविधि", "Actividad", "Activité", "Aktivität", "Activiteit", "Attività"],
  "Care Score": ["केयर स्कोर", "Puntuación de cuidado", "Score de soins", "Pflegewert", "Zorgscore", "Punteggio cura"],
  "Clicker": ["क्लिकर", "Clicker", "Clicker", "Clicker", "Clicker", "Clicker"],
  "Whistle": ["सीटी", "Silbato", "Sifflet", "Pfeife", "Fluitje", "Fischietto"],
  "Calendar": ["कैलेंडर", "Calendario", "Calendrier", "Kalender", "Kalender", "Calendario"],
  "Pet Name": ["पेट का नाम", "Nombre de la mascota", "Nom de l'animal", "Name des Tieres", "Naam huisdier", "Nome dell'animale"],
  "Breed": ["नस्ल", "Raza", "Race", "Rasse", "Ras", "Razza"],
  "Gender": ["लिंग", "Género", "Sexe", "Geschlecht", "Geslacht", "Sesso"],
  "Male": ["नर", "Macho", "Mâle", "Männlich", "Mannelijk", "Maschio"],
  "Female": ["मादा", "Hembra", "Femelle", "Weiblich", "Vrouwelijk", "Femmina"],
  "Weight": ["वज़न", "Peso", "Poids", "Gewicht", "Gewicht", "Peso"],
  "Date": ["तारीख", "Fecha", "Date", "Datum", "Datum", "Data"],
  "Time": ["समय", "Hora", "Heure", "Uhrzeit", "Tijd", "Ora"],
  "Title": ["शीर्षक", "Título", "Titre", "Titel", "Titel", "Titolo"],
  "Repeat": ["दोहराएं", "Repetir", "Répéter", "Wiederholen", "Herhalen", "Ripeti"],
  "Once": ["एक बार", "Una vez", "Une fois", "Einmal", "Eenmalig", "Una volta"],
  "Every Day": ["हर दिन", "Cada día", "Tous les jours", "Jeden Tag", "Elke dag", "Ogni giorno"],
  "Every Week": ["हर हफ्ते", "Cada semana", "Chaque semaine", "Jede Woche", "Elke week", "Ogni settimana"],
  "Mute": ["म्यूट", "Silenciar", "Muet", "Stumm", "Dempen", "Silenzia"],
  "Yes": ["हां", "Sí", "Oui", "Ja", "Ja", "Sì"],
  "No": ["नहीं", "No", "Non", "Nein", "Nee", "No"],
  "OK": ["ठीक है", "Aceptar", "OK", "OK", "OK", "OK"],
  "Allow": ["अनुमति दें", "Permitir", "Autoriser", "Erlauben", "Toestaan", "Consenti"],
  "Decline": ["अस्वीकार करें", "Rechazar", "Refuser", "Ablehnen", "Weigeren", "Rifiuta"],
  "Review": ["समीक्षा", "Revisar", "Examiner", "Prüfen", "Bekijken", "Rivedi"],
  "Details missing": ["जानकारी अधूरी है", "Faltan datos", "Informations manquantes", "Angaben fehlen", "Gegevens ontbreken", "Dati mancanti"],
  "Unlocked": ["अनलॉक", "Desbloqueado", "Débloqué", "Freigeschaltet", "Ontgrendeld", "Sbloccato"],
  "Your Points": ["आपके पॉइंट्स", "Tus puntos", "Vos points", "Deine Punkte", "Jouw punten", "I tuoi punti"],
  "Paw Points": ["पॉ पॉइंट्स", "Puntos Paw", "Points Paw", "Paw-Punkte", "Paw-punten", "Punti Paw"],
  "Pet Parent": ["पेट पैरेंट", "Dueño", "Propriétaire", "Tierhalter", "Baasje", "Proprietario"],
  "Language": ["भाषा", "Idioma", "Langue", "Sprache", "Taal", "Lingua"],
  "App Language": ["ऐप की भाषा", "Idioma de la app", "Langue de l'app", "App-Sprache", "App-taal", "Lingua dell'app"],
  "January": ["जनवरी", "Enero", "Janvier", "Januar", "Januari", "Gennaio"],
  "February": ["फ़रवरी", "Febrero", "Février", "Februar", "Februari", "Febbraio"],
  "March": ["मार्च", "Marzo", "Mars", "März", "Maart", "Marzo"],
  "April": ["अप्रैल", "Abril", "Avril", "April", "April", "Aprile"],
  "May": ["मई", "Mayo", "Mai", "Mai", "Mei", "Maggio"],
  "June": ["जून", "Junio", "Juin", "Juni", "Juni", "Giugno"],
  "July": ["जुलाई", "Julio", "Juillet", "Juli", "Juli", "Luglio"],
  "August": ["अगस्त", "Agosto", "Août", "August", "Augustus", "Agosto"],
  "September": ["सितंबर", "Septiembre", "Septembre", "September", "September", "Settembre"],
  "October": ["अक्टूबर", "Octubre", "Octobre", "Oktober", "Oktober", "Ottobre"],
  "November": ["नवंबर", "Noviembre", "Novembre", "November", "November", "Novembre"],
  "December": ["दिसंबर", "Diciembre", "Décembre", "Dezember", "December", "Dicembre"],
  "Jan": ["जन", "Ene", "Janv", "Jan", "Jan", "Gen"],
  "Feb": ["फ़र", "Feb", "Févr", "Feb", "Feb", "Feb"],
  "Mar": ["मार्च", "Mar", "Mars", "Mär", "Mrt", "Mar"],
  "Apr": ["अप्रै", "Abr", "Avr", "Apr", "Apr", "Apr"],
  "Jun": ["जून", "Jun", "Juin", "Jun", "Jun", "Giu"],
  "Jul": ["जुला", "Jul", "Juil", "Jul", "Jul", "Lug"],
  "Aug": ["अग", "Ago", "Août", "Aug", "Aug", "Ago"],
  "Sep": ["सित", "Sep", "Sept", "Sep", "Sep", "Set"],
  "Oct": ["अक्टू", "Oct", "Oct", "Okt", "Okt", "Ott"],
  "Nov": ["नव", "Nov", "Nov", "Nov", "Nov", "Nov"],
  "Dec": ["दिस", "Dic", "Déc", "Dez", "Dec", "Dic"],
  "Mon": ["सोम", "Lun", "Lun", "Mo", "Ma", "Lun"],
  "Tue": ["मंगल", "Mar", "Mar", "Di", "Di", "Mar"],
  "Wed": ["बुध", "Mié", "Mer", "Mi", "Wo", "Mer"],
  "Thu": ["गुरु", "Jue", "Jeu", "Do", "Do", "Gio"],
  "Fri": ["शुक्र", "Vie", "Ven", "Fr", "Vr", "Ven"],
  "Sat": ["शनि", "Sáb", "Sam", "Sa", "Za", "Sab"],
  "Sun": ["रवि", "Dom", "Dim", "So", "Zo", "Dom"],
  "Monday": ["सोमवार", "Lunes", "Lundi", "Montag", "Maandag", "Lunedì"],
  "Tuesday": ["मंगलवार", "Martes", "Mardi", "Dienstag", "Dinsdag", "Martedì"],
  "Wednesday": ["बुधवार", "Miércoles", "Mercredi", "Mittwoch", "Woensdag", "Mercoledì"],
  "Thursday": ["गुरुवार", "Jueves", "Jeudi", "Donnerstag", "Donderdag", "Giovedì"],
  "Friday": ["शुक्रवार", "Viernes", "Vendredi", "Freitag", "Vrijdag", "Venerdì"],
  "Saturday": ["शनिवार", "Sábado", "Samedi", "Samstag", "Zaterdag", "Sabato"],
  "Sunday": ["रविवार", "Domingo", "Dimanche", "Sonntag", "Zondag", "Domenica"],
  "Today": ["आज", "Hoy", "Aujourd'hui", "Heute", "Vandaag", "Oggi"],
  "Yesterday": ["कल", "Ayer", "Hier", "Gestern", "Gisteren", "Ieri"],
  "Know Your Pet": ["अपने पेट को जानें", "Conoce a tu mascota", "Connaître votre animal", "Lerne dein Tier kennen", "Ken je huisdier", "Conosci il tuo animale"],
};

const MAP = new Map<string, string[]>(Object.entries(D));
let current: TLang = "en";

/* ---------- strings translated by the server (AI + shared cache), for everything not in the list above ---------- */
const remote = new Map<string, Map<string, string>>(); // lang -> English -> translated
// Track bounded retries so partial model responses do not silently strand labels,
// but also do not create an infinite translation request loop.
const attempts = new Map<string, number>();
const deferred = new Set<string>(); // network/rate-limit failures retried on next session
const pending = new Set<string>();
let version = 0;
const listeners = new Set<() => void>();
export const subscribeAutoTranslate = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };
export const getAutoTranslateVersion = () => version;
const bump = () => { version += 1; listeners.forEach((fn) => fn()); };
let timer: ReturnType<typeof setTimeout> | null = null;
let busy = false;

/* The pet's name is replaced by the guide text's sample name ("Milo") for lookups, then put back. */
let petName = "";
export const setTranslationPetName = (name: string) => { petName = name && name !== "your pet" ? name : ""; };

const LOCALES: Record<TLang, string> = { en: "en-US", hi: "hi-IN", es: "es-ES", fr: "fr-FR", de: "de-DE", nl: "nl-NL", it: "it-IT" };
/** Locale for dates and numbers, following the app language instead of the phone's. */
export const appLocale = () => LOCALES[current];

/* One request fetches every string already translated for the language (see backend GET /api/translations/:lang). */
const bundleLoaded = new Set<string>();
const bundleLoading = new Set<string>();
async function loadBundle(lang: TLang) {
  if (lang === "en" || bundleLoaded.has(lang) || bundleLoading.has(lang)) return;
  bundleLoading.add(lang);
  try {
    const data: any = await api(`/api/translations/${lang}`, { auth: false });
    const map = remote.get(lang) ?? new Map<string, string>();
    for (const [src, out] of Object.entries(data?.translations ?? {})) if (typeof out === "string" && out) map.set(src, out);
    remote.set(lang, map);
    bundleLoaded.add(lang);
    if (lang === current) bump();
  } catch { /* offline: single strings are still requested one by one */ }
  finally { bundleLoading.delete(lang); }
}

export const setAutoTranslateLang = (l: TLang) => {
  if (l === current) return;
  current = l;
  pending.clear();
  void loadBundle(l);
  bump();
};

/** Translate short labels as well as full sentences; skip only numbers, symbols, emails and URLs. */
const worthTranslating = (t: string) =>
  t.length >= 1 && t.length <= 600 && /\p{L}/u.test(t) &&
  !/@|https?:\/\//.test(t) && !/^[\d\s.,:;/+%()-]+$/.test(t);

function queue(text: string) {
  if (current === "en") return;
  const key = `${current}:${text}`;
  if (remote.get(current)?.has(text) || !worthTranslating(text)) return;
  if ((attempts.get(key) ?? 0) >= 3) return;
  pending.add(text);
  if (!timer) timer = setTimeout(flush, 180);
}

async function flush() {
  timer = null;
  if (busy || current === "en" || pending.size === 0) return;
  busy = true;
  const lang = current;
  // Small batches produce more reliable JSON responses from the translation model.
  const batch = [...pending].slice(0, 20);
  batch.forEach((t) => pending.delete(t));
  try {
    const data: any = await api("/api/translate", {
      method: "POST",
      auth: false,
      body: { lang, texts: batch },
    });
    const map = remote.get(lang) ?? new Map<string, string>();
    let needsRetry = false;
    for (const text of batch) {
      const out = data?.translations?.[text];
      const key = `${lang}:${text}`;
      if (typeof out === "string" && out.trim()) {
        map.set(text, out.trim());
        attempts.delete(key);
      } else {
        const count = (attempts.get(key) ?? 0) + 1;
        attempts.set(key, count);
        if (count < 3) {
          pending.add(text);
          needsRetry = true;
        }
      }
    }
    remote.set(lang, map);
    if (lang === current) bump();
    if (needsRetry && !timer) timer = setTimeout(flush, 900);
  } catch {
    // Keep strings for a later retry (for example after connectivity returns or login).
    batch.forEach((text) => deferred.add(text));
  } finally {
    busy = false;
    if (pending.size && !timer) timer = setTimeout(flush, 180);
  }
}

const idx = (l: TLang) => ORDER.indexOf(l);
export function retryDeferredTranslations() {
  if (current === "en") return;
  void loadBundle(current);
  if (deferred.size === 0) return;
  for (const text of deferred) {
    if ((attempts.get(`${current}:${text}`) ?? 0) < 3) pending.add(text);
  }
  deferred.clear();
  if (pending.size && !timer) timer = setTimeout(flush, 50);
}

const SAMPLE_NAME = "Milo";
export function tr(text: string): string {
  if (current === "en") return text;
  const key = text.trim();
  const fixed = MAP.get(key)?.[idx(current)];
  if (fixed) return text.replace(key, fixed);
  const store = remote.get(current);
  const spaced = key.replace(/\s+/g, " ");
  const hit = store?.get(key) ?? store?.get(spaced);
  if (hit) return text.replace(key, hit);
  // Guide pages are written for "Milo" and personalised afterwards: look the sentence up with the sample name.
  if (petName && key.includes(petName)) {
    const generic = spaced.split(petName).join(SAMPLE_NAME);
    const g = store?.get(generic);
    if (g) return text.replace(key, g.split(SAMPLE_NAME).join(petName));
  }
  // Dates and short phrases made only of dictionary words and numbers ("03 Nov 2026", "November 2026").
  if (/\s/.test(key) && key.length < 40) {
    const words = key.match(/\p{L}+/gu) ?? [];
    if (words.length && words.every((w) => MAP.has(w))) {
      return text.replace(/\p{L}+/gu, (w) => MAP.get(w)![idx(current)] ?? w);
    }
  }
  if (key) queue(key);
  return text;
}
let installed = false;
/** Install only Alert translation. Text/TextInput are handled by explicit wrappers on every route. */
export function installAutoTranslate() {
  if (installed) return;
  installed = true;
  const alertOrig = Alert.alert.bind(Alert);
  (Alert as any).alert = (title: string, message?: string, ...rest: any[]) =>
    alertOrig(tr(title), message ? tr(message) : message, ...rest);
}
void React;
