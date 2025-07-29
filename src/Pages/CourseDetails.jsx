import React from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import TranslateIcon from '@mui/icons-material/Translate';

const courseInfo = [
  { icon: <AccessTimeIcon sx={{ color: '#ff4c4c' }} />, label: 'Durations:', value: '10 hours' },
  { icon: <FolderIcon sx={{ color: '#ff4c4c' }} />, label: 'Lectures:', value: '15' },
  { icon: <GroupIcon sx={{ color: '#1e88e5' }} />, label: 'Students:', value: 'Max 50' },
  { icon: <SchoolIcon sx={{ color: '#ff4c4c' }} />, label: 'Skill Level:', value: 'Advanced' },
  { icon: <TranslateIcon sx={{ color: '#263238' }} />, label: 'Language:', value: 'English' },
];

const CourseDetails = () => (
  <Box>
    {/* ===== Banner ===== */}
    <Box
      sx={{
        height: 300,
        backgroundImage: 'url(/PageBanner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'rgba(0,0,0,0.7)',
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 10 } }}>
        <Typography variant="h3" fontWeight="bold">
          Course Details
        </Typography>
        <Breadcrumbs sx={{ mt: 1 }} separator="›">
          <Link underline="hover" href="/" sx={{ color: 'red' }}>
            Home
          </Link>
          <Typography sx={{ color: 'red' }}>Course Details</Typography>
        </Breadcrumbs>
      </Box>
    </Box>

    {/* ===== Content Section ===== */}
    <Box
      sx={{
        px: { xs: 2, md: 10 },
        py: 8,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4,
      }}
    >
      {/* ===== Left Column ===== */}
      <Box sx={{ flex: 1 }}>
        <Card sx={{ boxShadow: 2, p: 2 }}>
          {courseInfo.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                borderBottom: i !== courseInfo.length - 1 ? '1px dotted #ccc' : 'none',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                <Typography variant="subtitle2">{item.label}</Typography>
              </Box>
              <Typography variant="subtitle2" fontWeight="bold" color="#263238">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Card>

        {/* Price Section */}
        <Card
          sx={{
            boxShadow: 2,
            mt: 4,
            textAlign: 'center',
            py: 3,
            backgroundColor: 'rgba(247, 247, 247, 0.39)',
          }}
        >
          <Typography variant="caption" color="textSecondary">
            COURSE PRICE
          </Typography>
          <Typography variant="h5" color="#ff4c4c" fontWeight={600} my={1}>
            $18.00
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#ff4c4c',
              fontWeight: 'bold',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
              '&:hover': { backgroundColor: '#e53935' },
            }}
          >
            BUY THIS COURSE
          </Button>
        </Card>
      </Box>

      {/* ===== Right Column ===== */}
      <Box sx={{ flex: 2 }}>
        <Box
          component="img"
          src="/CourseBanner.jpg"
          alt="course"
          width="100%"
          sx={{ borderRadius: 2, mb: 3 }}
        />

        <Typography variant="h5" fontWeight="bold" mb={2}>
          Course Overview
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={2}>
          Lorem ipsum is simply free text used by copytyping refreshing. Neque porro est qui dolorem ipsum quia
          quaed inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim
          var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy text of the printing.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          When an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default CourseDetails;
