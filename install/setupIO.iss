; Script generated by the Inno Setup Script Wizard.
; SEE THE DOCUMENTATION FOR DETAILS ON CREATING INNO SETUP SCRIPT FILES!

#define AppName "IOsys"
#define AppVersion "1.0"
#define ChromeApp "chrome.exe"
#define BaseAdminApp "app_admin.exe"

[Setup]
; NOTE: The value of AppId uniquely identifies this application.
; Do not use the same AppId value in installers for other applications.
; (To generate a new GUID, click Tools | Generate GUID inside the IDE.)
AppId={{C8BBB7AC-23BB-4C3B-BCBD-35BD2C4F575C}
AppName={#AppName}
AppVersion={#AppVersion}
;AppVerName={#AppName} {#AppVersion}
DefaultDirName={pf}\{#AppName}
DefaultGroupName={#AppName}
OutputDir=F:\DVN_Projects\install\install_out
OutputBaseFilename=setupWIN32IOSys
Compression=lzma
SolidCompression=yes


[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"; LicenseFile: "LICENSE_eng.txt"
Name: "russian"; MessagesFile: "compiler:Languages\Russian.isl"; LicenseFile: "LICENSE_eng.txt"

[Files]
Source: "F:\DVN_Projects\install\bin\install_test.exe"; DestDir: "{app}\bin"; Flags: ignoreversion;  
Source: "F:\DVN_Projects\install\bin\*"; DestDir: "{app}\bin"; Flags: ignoreversion recursesubdirs createallsubdirs;
Source: "{code:projectDir|'������� ���������� �������'}"; DestDir: "{app}\project"; Tasks: projectinstall; Flags: ignoreversion recursesubdirs createallsubdirs dontcopy external;

[Icons]
Name: "{group}\RT"; Filename: "{app}\bin\{#ChromeApp}"; Parameters: "--dvnci-runtime"; IconFilename: "{app}\bin\rt.ico"
Name: "{group}\DT"; Filename: "{app}\bin\{#ChromeApp}"; Parameters: "--dvnci-runtime --dvnci-editable"; IconFilename: "{app}\bin\dt.ico"
Name: "{group}\AdminBase"; Filename: "{app}\bin\{#BaseAdminApp}"; IconFilename: "{app}\bin\base.ico"
Name: "{commondesktop}\RT"; Filename: "{app}\bin\{#ChromeApp}"; Parameters: "--dvnci-runtime"; IconFilename: "{app}\bin\rt.ico"; 
Name: "{commondesktop}\DT"; Filename: "{app}\bin\{#ChromeApp}"; Parameters: "--dvnci-runtime --dvnci-editable"; IconFilename: "{app}\bin\dt.ico"; 
Name: "{commondesktop}\AdminBase"; Filename: "{app}\bin\{#BaseAdminApp}"; IconFilename: "{app}\bin\base.ico";
Name: "{group}\Uninstall\{cm:UninstallProgram,{#AppName}}"; Filename: "{uninstallexe}"


;[Run]
;Filename: "install_test.exe"; WorkingDir: "{app}"; Flags: shellexec waituntilterminated

[Tasks]
Name: "projectinstall"; Description: "Project Install"; Flags: checkablealone; Components: projectinstall

[Types]
Name: "Full"; Description: "Full"; Flags: iscustom
Name: "Simple"; Description: "Simple"

[Components]
Name: "projectinstall"; Description: "Project Install"; Flags: checkablealone

[Registry]
Root: "HKLM"; Subkey: "Software\DVNCI\"; ValueType: string; ValueName: "path"; ValueData: "{app}\project\base\"; Flags: createvalueifdoesntexist deletekey

[Dirs]
Name: "{app}\project"; Flags: deleteafterinstall; Components: projectinstall; Tasks: projectinstall

[Code]
var  
prjFolder: String;

function projectDir(Param: String): String;
begin
  BrowseForFolder(Param ,  prjFolder, false);
  result:=prjFolder;
end;
