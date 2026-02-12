import subprocess
import sys

def run_command(command):
    print(f"Executing: {' '.join(command)}")
    try:
        result = subprocess.run(command, check=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        if "nothing to commit" in e.stdout or "nothing to commit" in e.stderr:
            print("Nothing to commit.")
        else:
            print(f"Error executing command: {e.stderr}")
            if command[1] != "commit": 
                sys.exit(1)

def main():
    run_command(["git", "add", "."])
    run_command(["git", "commit", "-m", "fix: optimize ws host header and tls sni logic to prevent 502"])
    run_command(["git", "push", "origin", "main"])

if __name__ == "__main__":
    main()
