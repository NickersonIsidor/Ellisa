@ECHO OFF
SET DIR=%~dp0
SET APP_BASE_NAME=%~n0
SET APP_HOME=%DIR%
"%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" 1>nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
ECHO Gradle wrapper JAR missing. Please run: gradle wrapper
EXIT /B 1
)
java -Xmx64m -cp "%APP_HOME%\gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*