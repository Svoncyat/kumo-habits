import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBcrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "demo123";
        String hash = "$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK";
        
        System.out.println("Testing password: " + password);
        System.out.println("Hash from seed: " + hash);
        System.out.println("Matches: " + encoder.matches(password, hash));
        
        String newHash = encoder.encode(password);
        System.out.println("New hash: " + newHash);
    }
}
