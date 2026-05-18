use tauri_plugin_dialog::DialogExt;
use walkdir::WalkDir;

use std::path::Path;

use serde::Serialize;

#[derive(Serialize)]
struct FileEntry {
    name: String,
    full_path: String,
}

#[tauri::command]
async fn open_folder(app: tauri::AppHandle) -> Option<String> {
    let result = app
        .dialog()
        .file()
        .blocking_pick_folder();

    result.map(|p| p.to_string())
}

#[tauri::command]
fn read_folder(path: String) -> Result<Vec<FileEntry>, String> {
    let root = Path::new(&path);

    let files: Vec<FileEntry> = WalkDir::new(root)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.path().is_file())
        .filter_map(|entry| {
            let full_path = entry
                .path()
                .to_string_lossy()
                .to_string();

            let relative_path = entry
                .path()
                .strip_prefix(root)
                .ok()?
                .to_string_lossy()
                .to_string();

            Some(FileEntry {
                name: relative_path,
                full_path,
            })
        })
        .collect();

    Ok(files)
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