import { useEffect, useRef } from "react";
import Terminal, { TerminalHandle } from "../../components/Terminal";
import { useAdb } from "../../context/AdbProvider";
import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import PageLayout from "../../layouts/PageLayout";
import { openDownloadModal, openUploadModal } from "../../modals";
import { IconDownload, IconUpload } from "@tabler/icons-react";

const Console = () => {
  const { connInfo, sendCommand, subscribeOutput } = useAdb();
  const isConn = connInfo != null;

  const terminalRef = useRef<TerminalHandle | null>(null);

  // Subscribe to ADB output and write it to the Terminal.
  useEffect(() => {
    const unsubscribe = subscribeOutput((data: string) => {
      terminalRef.current?.write(data);
    });
    return () => unsubscribe();
  }, [subscribeOutput]);

  return (
    <PageLayout title="ADB Console">
      <Stack>
        <Paper h="600px" p="md" bg="#000" withBorder>
          <Terminal
            ref={terminalRef}
            onCommand={(command: string) => {
              sendCommand(command);
            }}
          />
        </Paper>
        <Title order={3} size="lg">
          Transfer Files
        </Title>
        <Group>
          <Button
            onClick={openDownloadModal}
            disabled={!isConn}
            rightSection={<IconDownload size={14} />}
          >
            Download File
          </Button>
          <Button
            onClick={openUploadModal}
            disabled={!isConn}
            rightSection={<IconUpload size={14} />}
          >
            Upload File
          </Button>
        </Group>
      </Stack>
    </PageLayout>
  );
};

export default Console;
