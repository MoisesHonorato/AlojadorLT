<?php
// backend/get_houses.php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'database.php';
require_once 'auth.php';

// check_auth(); 

try {
    // 1. Get all republicas
    $republicas_stmt = $pdo->query("SELECT id, nome as name, endereco as location FROM republicas");
    $republicas = $republicas_stmt->fetchAll();

    $final_data = [];

    foreach ($republicas as $rep) {
        $rep_id = $rep['id'];
        
        // 2. Get rooms for this republica
        $rooms_stmt = $pdo->prepare("SELECT id, numero_quarto as name, capacidade_vagas as capacity FROM quartos WHERE republica_id = ?");
        $rooms_stmt->execute([$rep_id]);
        $rooms = $rooms_stmt->fetchAll();

        $final_rooms = [];
        foreach ($rooms as $room) {
            $room_id = $room['id'];

            // 3. Get occupants for this room (only active ones)
            $occupants_stmt = $pdo->prepare("SELECT colaborador_id FROM alocacoes WHERE quarto_id = ? AND status = 'Ativo'");
            $occupants_stmt->execute([$room_id]);
            $allocations = $occupants_stmt->fetchAll();

            $occupant_ids = array_map(fn($a) => (string)$a['colaborador_id'], $allocations);

            // Create array of capacity size and fill with occupant ids
            $occupants_array = array_fill(0, (int)$room['capacity'], null);
            foreach ($occupant_ids as $idx => $id) {
                if ($idx < (int)$room['capacity']) {
                    $occupants_array[$idx] = $id;
                }
            }

            $final_rooms[] = [
                'id'        => (string)$room_id,
                'name'      => $room['name'],
                'capacity'  => (int)$room['capacity'],
                'occupants' => $occupants_array
            ];
        }

        $final_data[] = [
            'id'       => (string)$rep_id,
            'name'     => $rep['name'],
            'location' => $rep['location'],
            'rooms'    => $final_rooms
        ];
    }

    echo json_encode($final_data);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
