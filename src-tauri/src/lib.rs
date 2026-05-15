use tauri_plugin_dialog::DialogExt;

#[tauri::command]
async fn open_folder(app: tauri::AppHandle) -> Option<String> {
    let result = app
        .dialog()
        .file()
        .blocking_pick_folder();

    result.map(|p| p.to_string())
}

#[tauri::command]
fn read_folder(path: String) -> Result<Vec<String>, String> {
    let entries = std::fs::read_dir(&path)
        .map_err(|e| e.to_string())?;

    Ok(entries
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();

            if path.is_file() {
                Some(path.to_string_lossy().to_string())
            } else {
                None
            }
        })
        .collect())
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(&path)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content)
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            open_folder,
            read_folder,
            read_file,
            write_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}