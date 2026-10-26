package pumpManagment;

import org.junit.Test;
import pumpManagment.util.PumpDatabaseNamingUtil;

import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.*;

public class PumpDatabaseNamingUtilTest {

    @Test
    public void testStandardPumpNames() {
        assertEquals("shree_shkc_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree SHKC"));
        assertEquals("shree_harsiddhi_kisan_seva_kendra_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree Harsiddhi Kisan Seva Kendra"));
        assertEquals("abc_petrol_pump_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("ABC Petrol Pump"));
    }

    @Test
    public void testWhitespaceAndSpecialCharacters() {
        assertEquals("shree_shkc_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("   Shree   SHKC   "));
        assertEquals("shree_shkc_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree-SHKC"));
        assertEquals("shree_shkc_db", PumpDatabaseNamingUtil.generatePumpDatabaseName("Shree @#$ SHKC!!!"));
    }

    @Test
    public void testSqlInjectionPrevention() {
        String unsafe = "Shree'; DROP DATABASE petrol_pump; --";
        String safeName = PumpDatabaseNamingUtil.generatePumpDatabaseName(unsafe);
        assertEquals("shree_drop_database_petrol_pump_db", safeName);
        assertTrue(safeName.matches("^[a-z0-9_]+$"));
    }

    @Test
    public void testDuplicateHandling() {
        Set<String> existing = new HashSet<>();
        existing.add("shree_shkc_db");

        String uniqueName = PumpDatabaseNamingUtil.generateUniquePumpDatabaseName("Shree SHKC", existing);
        assertEquals("shree_shkc_2_db", uniqueName);

        existing.add("shree_shkc_2_db");
        String uniqueName3 = PumpDatabaseNamingUtil.generateUniquePumpDatabaseName("Shree SHKC", existing);
        assertEquals("shree_shkc_3_db", uniqueName3);
    }
}
